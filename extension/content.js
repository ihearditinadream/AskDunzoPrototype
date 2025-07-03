// AskDunzo Content Script - Injects features into websites

let activeFeatures = new Map();
let isInitialized = false;

// Initialize the extension on page load
function initialize() {
  if (isInitialized) return;
  isInitialized = true;
  
  // Load saved features for this domain
  loadFeaturesForDomain();
  
  // Listen for messages from the extension popup
  chrome.runtime.onMessage.addListener(handleMessage);
  
  // Create the floating AskDunzo button
  createFloatingButton();
}

// Create the floating AskDunzo button
function createFloatingButton() {
  const button = document.createElement('div');
  button.id = 'askdunzo-floating-button';
  button.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
      <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="none"/>
      <text x="12" y="16" text-anchor="middle" font-size="12" fill="white">D</text>
    </svg>
  `;
  
  // Add click handler to show input box
  button.addEventListener('click', showInputBox);
  
  document.body.appendChild(button);
}

// Show the input box for user requests
function showInputBox() {
  // Check if input box already exists
  let inputContainer = document.getElementById('askdunzo-input-container');
  if (inputContainer) {
    inputContainer.style.display = 'block';
    return;
  }
  
  // Create input container
  inputContainer = document.createElement('div');
  inputContainer.id = 'askdunzo-input-container';
  inputContainer.innerHTML = `
    <div class="askdunzo-input-header">
      <img src="${chrome.runtime.getURL('icons/icon-32.png')}" alt="AskDunzo" />
      <span>What would you like to add or change on this site?</span>
      <button class="askdunzo-close" aria-label="Close">&times;</button>
    </div>
    <textarea 
      class="askdunzo-input-field" 
      placeholder="What would you like to add or change on this site?"
      rows="3"
    ></textarea>
    <p class="askdunzo-note" style="margin: 8px 0; font-size: 13px; color: #666; text-align: center;">Type your request, and Dunzo will make it happen!</p>
    <div class="askdunzo-input-actions">
      <button class="askdunzo-btn askdunzo-btn-primary">Generate Feature</button>
      <button class="askdunzo-btn askdunzo-btn-secondary">Cancel</button>
    </div>
    <div class="askdunzo-loading" style="display: none;">
      <div class="askdunzo-spinner"></div>
      <span>Dunzo is analyzing and generating your feature...</span>
    </div>
  `;
  
  document.body.appendChild(inputContainer);
  
  // Add event handlers
  const closeBtn = inputContainer.querySelector('.askdunzo-close');
  const cancelBtn = inputContainer.querySelector('.askdunzo-btn-secondary');
  const generateBtn = inputContainer.querySelector('.askdunzo-btn-primary');
  const textarea = inputContainer.querySelector('.askdunzo-input-field');
  
  closeBtn.addEventListener('click', () => hideInputBox());
  cancelBtn.addEventListener('click', () => hideInputBox());
  generateBtn.addEventListener('click', () => handleFeatureRequest(textarea.value));
  
  // Focus the textarea
  textarea.focus();
}

// Hide the input box
function hideInputBox() {
  const inputContainer = document.getElementById('askdunzo-input-container');
  if (inputContainer) {
    inputContainer.style.display = 'none';
  }
}

// Handle feature request
async function handleFeatureRequest(request) {
  if (!request.trim()) return;
  
  const inputContainer = document.getElementById('askdunzo-input-container');
  const loadingDiv = inputContainer.querySelector('.askdunzo-loading');
  const actionsDiv = inputContainer.querySelector('.askdunzo-input-actions');
  const textarea = inputContainer.querySelector('.askdunzo-input-field');
  
  // Show loading state
  loadingDiv.style.display = 'flex';
  actionsDiv.style.display = 'none';
  textarea.disabled = true;
  
  try {
    // Capture page context
    const context = capturePageContext();
    
    // Send request to background script
    const response = await chrome.runtime.sendMessage({
      action: 'generateFeature',
      request: request,
      context: context,
      url: window.location.href
    });
    
    if (response.success) {
      // Inject the generated feature
      await injectFeature(response.feature);
      
      // Hide input box
      hideInputBox();
      
      // Show success notification
      showNotification('Feature added successfully!', 'success');
    } else {
      throw new Error(response.error || 'Failed to generate feature');
    }
  } catch (error) {
    console.error('AskDunzo Error:', error);
    showNotification('Failed to generate feature. Please try again.', 'error');
  } finally {
    // Reset UI
    loadingDiv.style.display = 'none';
    actionsDiv.style.display = 'flex';
    textarea.disabled = false;
  }
}

// Capture page context for AI analysis
function capturePageContext() {
  const context = {
    // DOM structure
    html: document.documentElement.outerHTML,
    
    // Computed styles of key elements
    styles: captureKeyStyles(),
    
    // Page metadata
    title: document.title,
    url: window.location.href,
    domain: window.location.hostname,
    
    // Existing scripts and stylesheets
    scripts: Array.from(document.scripts).map(s => s.src).filter(Boolean),
    stylesheets: Array.from(document.styleSheets).map(s => s.href).filter(Boolean)
  };
  
  return context;
}

// Capture key styles from the page
function captureKeyStyles() {
  const styles = {};
  const elements = ['body', 'button', 'a', 'h1', 'h2', 'p', 'input'];
  
  elements.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      const computed = window.getComputedStyle(element);
      styles[selector] = {
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        borderRadius: computed.borderRadius,
        padding: computed.padding,
        margin: computed.margin
      };
    }
  });
  
  return styles;
}

// Sanitize a DOM node to prevent XSS
function sanitizeNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.cloneNode(true);
  }
  
  if (node.nodeType === Node.ELEMENT_NODE) {
    const tagName = node.tagName.toLowerCase();
    
    // Block dangerous elements
    const dangerousTags = ['script', 'iframe', 'object', 'embed', 'link', 'meta', 'style'];
    if (dangerousTags.includes(tagName)) {
      return null;
    }
    
    // Create safe element
    const safeElement = document.createElement(tagName);
    
    // Copy safe attributes
    const dangerousAttrs = /^(on|javascript:|data:)/i;
    Array.from(node.attributes).forEach(attr => {
      if (!dangerousAttrs.test(attr.name) && !dangerousAttrs.test(attr.value)) {
        safeElement.setAttribute(attr.name, attr.value);
      }
    });
    
    // Recursively sanitize children
    Array.from(node.childNodes).forEach(child => {
      const safeChild = sanitizeNode(child);
      if (safeChild) {
        safeElement.appendChild(safeChild);
      }
    });
    
    return safeElement;
  }
  
  return null;
}

// Inject a feature into the page
async function injectFeature(feature) {
  const featureId = `askdunzo-feature-${Date.now()}`;
  
  // Inject CSS
  if (feature.css) {
    const style = document.createElement('style');
    style.id = `${featureId}-css`;
    style.textContent = feature.css;
    document.head.appendChild(style);
  }
  
  // Inject HTML
  if (feature.html) {
    const container = document.createElement('div');
    container.id = featureId;
    
    // Parse HTML safely without executing scripts
    const tempDiv = document.createElement('div');
    const parser = new DOMParser();
    const doc = parser.parseFromString(feature.html, 'text/html');
    Array.from(doc.body.childNodes).forEach(node => tempDiv.appendChild(node));
    
    // Clone nodes without scripts
    const safeNodes = Array.from(tempDiv.childNodes).map(node => {
      return sanitizeNode(node);
    }).filter(Boolean);
    
    safeNodes.forEach(node => container.appendChild(node));
    
    // Find injection point or append to body
    const injectionPoint = feature.injectionPoint ? 
      document.querySelector(feature.injectionPoint) : 
      document.body;
    
    if (feature.injectionMethod === 'prepend') {
      injectionPoint.prepend(container);
    } else {
      injectionPoint.appendChild(container);
    }
  }
  
  // Inject JavaScript
  if (feature.js) {
    const script = document.createElement('script');
    script.id = `${featureId}-js`;
    script.textContent = `(function() { ${feature.js} })();`;
    document.body.appendChild(script);
  }
  
  // Save feature for persistence
  activeFeatures.set(featureId, feature);
  await saveFeature(featureId, feature);
}

// Save feature to storage
async function saveFeature(featureId, feature) {
  const domain = window.location.hostname;
  const storage = await chrome.storage.local.get([domain]) || {};
  
  if (!storage[domain]) {
    storage[domain] = {};
  }
  
  storage[domain][featureId] = {
    ...feature,
    createdAt: Date.now(),
    enabled: true
  };
  
  await chrome.storage.local.set(storage);
}

// Load saved features for current domain
async function loadFeaturesForDomain() {
  const domain = window.location.hostname;
  const storage = await chrome.storage.local.get([domain]);
  
  if (storage[domain]) {
    for (const [featureId, feature] of Object.entries(storage[domain])) {
      if (feature.enabled) {
        await injectFeature(feature);
      }
    }
  }
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `askdunzo-notification askdunzo-notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Handle messages from popup or background
function handleMessage(request, sender, sendResponse) {
  switch (request.action) {
    case 'toggleFeature':
      toggleFeature(request.featureId, request.enabled);
      sendResponse({ success: true });
      break;
      
    case 'removeFeature':
      removeFeature(request.featureId);
      sendResponse({ success: true });
      break;
      
    case 'getActiveFeatures':
      sendResponse({ features: Array.from(activeFeatures.entries()) });
      break;
      
    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }
  
  return true; // Keep message channel open for async response
}

// Toggle feature on/off
async function toggleFeature(featureId, enabled) {
  const feature = activeFeatures.get(featureId);
  if (!feature) return;
  
  const elements = [
    document.getElementById(`${featureId}-css`),
    document.getElementById(`${featureId}-js`),
    document.getElementById(featureId)
  ];
  
  elements.forEach(el => {
    if (el) {
      el.style.display = enabled ? '' : 'none';
    }
  });
  
  // Update storage
  const domain = window.location.hostname;
  const storage = await chrome.storage.local.get([domain]);
  if (storage[domain] && storage[domain][featureId]) {
    storage[domain][featureId].enabled = enabled;
    await chrome.storage.local.set(storage);
  }
}

// Remove feature completely
async function removeFeature(featureId) {
  const elements = [
    document.getElementById(`${featureId}-css`),
    document.getElementById(`${featureId}-js`),
    document.getElementById(featureId)
  ];
  
  elements.forEach(el => el?.remove());
  
  activeFeatures.delete(featureId);
  
  // Remove from storage
  const domain = window.location.hostname;
  const storage = await chrome.storage.local.get([domain]);
  if (storage[domain] && storage[domain][featureId]) {
    delete storage[domain][featureId];
    await chrome.storage.local.set(storage);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}