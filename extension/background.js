// AskDunzo Background Service Worker

// API endpoint for the Dunzo AI Service
const API_BASE_URL = 'https://askdunzo.com/api';

// User authentication state
let userToken = null;
let userSubscription = null;

// Initialize the extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('AskDunzo extension installed');
  
  // Check authentication status
  checkAuthentication();
  
  // Set up context menu
  chrome.contextMenus.create({
    id: 'askdunzo-context',
    title: 'Ask Dunzo to modify this',
    contexts: ['page', 'selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'askdunzo-context') {
    // Send message to content script to show input box
    chrome.tabs.sendMessage(tab.id, { action: 'showInputBox' });
  }
});

// Check user authentication
async function checkAuthentication() {
  try {
    const { token } = await chrome.storage.sync.get(['token']);
    if (token) {
      userToken = token;
      await fetchUserSubscription();
    }
  } catch (error) {
    console.error('Auth check failed:', error);
  }
}

// Fetch user subscription details
async function fetchUserSubscription() {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/users/me`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const user = await response.json();
      userSubscription = user.subscriptionTier;
    } else if (response.status === 401) {
      // Token expired or invalid
      userToken = null;
      await chrome.storage.sync.remove(['token']);
    }
  } catch (error) {
    console.error('Failed to fetch user subscription:', error);
  }
}

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'generateFeature':
      handleGenerateFeature(request, sender, sendResponse);
      return true; // Will respond asynchronously
      
    case 'authenticate':
      handleAuthentication(request, sendResponse);
      return true;
      
    case 'getAuthStatus':
      sendResponse({ 
        authenticated: !!userToken, 
        subscription: userSubscription 
      });
      break;
      
    case 'logout':
      handleLogout(sendResponse);
      break;
      
    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }
});

// Handle feature generation requests
async function handleGenerateFeature(request, sender, sendResponse) {
  try {
    // Check if user is authenticated
    if (!userToken) {
      sendResponse({ 
        success: false, 
        error: 'Please log in to use AskDunzo',
        requiresAuth: true 
      });
      return;
    }
    
    // Check feature limits for free tier
    if (userSubscription === 'free') {
      const { featureCount } = await chrome.storage.local.get(['featureCount']);
      const count = featureCount || 0;
      
      if (count >= 3) {
        sendResponse({ 
          success: false, 
          error: 'Free tier limit reached. Upgrade to Premium for unlimited features.',
          requiresUpgrade: true 
        });
        return;
      }
    }
    
    // Send request to AI service
    const response = await fetch(`${API_BASE_URL}/v1/features/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        request: request.request,
        context: {
          url: request.url,
          html: request.context.html,
          styles: request.context.styles,
          metadata: {
            title: request.context.title,
            domain: request.context.domain
          }
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Validate the generated code
    const validatedFeature = await validateFeature(result.feature);
    
    if (validatedFeature.safe) {
      // Update feature count for free tier
      if (userSubscription === 'free') {
        const { featureCount } = await chrome.storage.local.get(['featureCount']);
        await chrome.storage.local.set({ 
          featureCount: (featureCount || 0) + 1 
        });
      }
      
      sendResponse({ 
        success: true, 
        feature: validatedFeature.feature 
      });
    } else {
      throw new Error('Generated code failed security validation');
    }
    
  } catch (error) {
    console.error('Feature generation error:', error);
    sendResponse({ 
      success: false, 
      error: error.message || 'Failed to generate feature' 
    });
  }
}

// Validate generated feature code
async function validateFeature(feature) {
  // Basic security checks
  const dangerousPatterns = [
    /eval\s*\(/,
    /new\s+Function\s*\(/,
    /document\.cookie/,
    /localStorage\./,
    /sessionStorage\./,
    /\.innerHTML\s*=/,
    /XMLHttpRequest/,
    /fetch\s*\(/,
    /window\.location/,
    /document\.write/
  ];
  
  const codeToCheck = [
    feature.js || '',
    feature.css || '',
    feature.html || ''
  ].join('\n');
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(codeToCheck)) {
      return { safe: false, reason: 'Dangerous pattern detected' };
    }
  }
  
  // Additional validation could be added here
  // For now, we'll trust the server-side validation
  
  return { safe: true, feature };
}

// Handle authentication
async function handleAuthentication(request, sendResponse) {
  try {
    const { token } = request;
    userToken = token;
    
    // Save token to storage
    await chrome.storage.sync.set({ token });
    
    // Fetch user details
    await fetchUserSubscription();
    
    sendResponse({ 
      success: true, 
      subscription: userSubscription 
    });
  } catch (error) {
    console.error('Authentication error:', error);
    sendResponse({ 
      success: false, 
      error: 'Authentication failed' 
    });
  }
}

// Handle logout
async function handleLogout(sendResponse) {
  try {
    userToken = null;
    userSubscription = null;
    
    // Clear storage
    await chrome.storage.sync.remove(['token']);
    await chrome.storage.local.clear();
    
    sendResponse({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    sendResponse({ 
      success: false, 
      error: 'Logout failed' 
    });
  }
}

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // Send message to content script to toggle floating button
  chrome.tabs.sendMessage(tab.id, { action: 'toggleFloatingButton' });
});

// Monitor tab updates to re-inject features if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Send message to content script to check and restore features
    chrome.tabs.sendMessage(tabId, { action: 'checkFeatures' })
      .catch(() => {
        // Content script might not be loaded yet
      });
  }
});

// Handle web requests to inject authentication headers
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    if (details.url.startsWith(API_BASE_URL) && userToken) {
      const headers = details.requestHeaders || [];
      headers.push({
        name: 'Authorization',
        value: `Bearer ${userToken}`
      });
      return { requestHeaders: headers };
    }
  },
  { urls: [`${API_BASE_URL}/*`] },
  ['blocking', 'requestHeaders']
);