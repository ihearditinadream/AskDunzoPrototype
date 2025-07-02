// Popup JavaScript

let currentTab = null;
let authStatus = null;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  // Show loading
  showLoading(true);
  
  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab;
  
  // Check authentication status
  authStatus = await checkAuthStatus();
  
  // Update UI based on auth status
  updateAuthUI();
  
  // Setup event listeners
  setupEventListeners();
  
  // Load features if authenticated
  if (authStatus.authenticated) {
    await loadActiveFeatures();
  }
  
  // Hide loading
  showLoading(false);
});

// Check authentication status
async function checkAuthStatus() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getAuthStatus' });
    return response;
  } catch (error) {
    console.error('Failed to check auth status:', error);
    return { authenticated: false };
  }
}

// Update authentication UI
function updateAuthUI() {
  const authSection = document.getElementById('auth-section');
  const quickActions = document.getElementById('quick-actions');
  const subscriptionStatus = document.getElementById('subscription-status');
  
  if (authStatus.authenticated) {
    // Show authenticated UI
    authSection.innerHTML = `
      <div class="user-info">
        <div class="user-avatar"></div>
        <div class="user-details">
          <h3>Welcome back!</h3>
          <p>${authStatus.subscription || 'free'} plan</p>
        </div>
      </div>
      <button class="auth-btn" id="logout-btn">Log Out</button>
    `;
    
    quickActions.style.display = 'block';
    
    // Update subscription status
    if (authStatus.subscription === 'free') {
      subscriptionStatus.innerHTML = `
        <span class="features-used">3 features per month</span>
        <span class="subscription-badge free">Free</span>
      `;
    } else {
      subscriptionStatus.innerHTML = `
        <span class="features-used">Unlimited features</span>
        <span class="subscription-badge">Premium</span>
      `;
    }
    subscriptionStatus.style.display = 'flex';
    
  } else {
    // Show login UI
    authSection.innerHTML = `
      <p class="auth-message">Sign in to start customizing websites</p>
      <button class="auth-btn" id="login-btn">Sign In</button>
    `;
    
    quickActions.style.display = 'none';
    subscriptionStatus.style.display = 'none';
  }
}

// Setup event listeners
function setupEventListeners() {
  // Auth buttons
  document.addEventListener('click', async (e) => {
    if (e.target.id === 'login-btn') {
      // Open login page
      chrome.tabs.create({ url: 'https://askdunzo.com/api/login' });
      window.close();
    } else if (e.target.id === 'logout-btn') {
      await handleLogout();
    }
  });
  
  // Quick actions
  const addFeatureBtn = document.getElementById('add-feature-btn');
  const manageFeaturesBtn = document.getElementById('manage-features-btn');
  
  if (addFeatureBtn) {
    addFeatureBtn.addEventListener('click', () => {
      // Send message to content script to show input box
      chrome.tabs.sendMessage(currentTab.id, { action: 'showInputBox' });
      window.close();
    });
  }
  
  if (manageFeaturesBtn) {
    manageFeaturesBtn.addEventListener('click', () => {
      toggleFeaturesView();
    });
  }
  
  // Footer links
  document.getElementById('settings-link').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
  
  document.getElementById('help-link').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://askdunzo.com/help' });
  });
}

// Handle logout
async function handleLogout() {
  showLoading(true);
  
  try {
    await chrome.runtime.sendMessage({ action: 'logout' });
    authStatus = { authenticated: false };
    updateAuthUI();
  } catch (error) {
    console.error('Logout failed:', error);
  }
  
  showLoading(false);
}

// Toggle features view
function toggleFeaturesView() {
  const quickActions = document.getElementById('quick-actions');
  const featuresSection = document.getElementById('features-section');
  const manageFeaturesBtn = document.getElementById('manage-features-btn');
  
  if (featuresSection.style.display === 'none') {
    quickActions.style.display = 'none';
    featuresSection.style.display = 'block';
    manageFeaturesBtn.textContent = 'Back to Actions';
  } else {
    quickActions.style.display = 'block';
    featuresSection.style.display = 'none';
    manageFeaturesBtn.textContent = 'Manage Features';
  }
}

// Load active features
async function loadActiveFeatures() {
  try {
    // Get features from content script
    const response = await chrome.tabs.sendMessage(currentTab.id, { 
      action: 'getActiveFeatures' 
    });
    
    if (response && response.features) {
      displayFeatures(response.features);
    }
  } catch (error) {
    // Content script might not be loaded
    console.log('No active features or content script not loaded');
    displayEmptyState();
  }
}

// Display features
function displayFeatures(features) {
  const featuresList = document.getElementById('features-list');
  
  if (features.length === 0) {
    displayEmptyState();
    return;
  }
  
  featuresList.innerHTML = features.map(([id, feature]) => `
    <div class="feature-item" data-feature-id="${id}">
      <div class="feature-header">
        <span class="feature-title">${feature.request || 'Custom Feature'}</span>
        <div class="feature-toggle ${feature.enabled ? 'active' : ''}" 
             data-feature-id="${id}"></div>
      </div>
      <div class="feature-domain">${new URL(currentTab.url).hostname}</div>
    </div>
  `).join('');
  
  // Add toggle listeners
  featuresList.querySelectorAll('.feature-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const featureId = toggle.dataset.featureId;
      const isActive = toggle.classList.contains('active');
      toggleFeature(featureId, !isActive);
      toggle.classList.toggle('active');
    });
  });
}

// Display empty state
function displayEmptyState() {
  const featuresList = document.getElementById('features-list');
  featuresList.innerHTML = `
    <div class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
      </svg>
      <p>No features added yet</p>
      <p style="font-size: 12px; margin-top: 8px;">
        Click "Add Feature" to get started
      </p>
    </div>
  `;
}

// Toggle feature on/off
async function toggleFeature(featureId, enabled) {
  try {
    await chrome.tabs.sendMessage(currentTab.id, {
      action: 'toggleFeature',
      featureId: featureId,
      enabled: enabled
    });
  } catch (error) {
    console.error('Failed to toggle feature:', error);
  }
}

// Show/hide loading
function showLoading(show) {
  const loading = document.getElementById('loading');
  loading.style.display = show ? 'flex' : 'none';
}

// Listen for auth updates
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'authUpdated') {
    // Refresh auth status and UI
    checkAuthStatus().then(status => {
      authStatus = status;
      updateAuthUI();
    });
  }
});