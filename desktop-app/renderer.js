const { ipcRenderer } = require('electron');

// DOM Elements
const authSection = document.getElementById('auth-section');
const mainContent = document.getElementById('main-content');
const loading = document.getElementById('loading');
const loginBtn = document.getElementById('login-btn');
const addFeatureBtn = document.getElementById('add-feature-btn');
const settingsBtn = document.getElementById('settings-btn');
const featuresList = document.getElementById('features-list');
const subscriptionStatus = document.getElementById('subscription-status');
const featureCount = document.getElementById('feature-count');

// State
let isAuthenticated = false;
let activeFeatures = [];

// Initialize
async function init() {
  // Check authentication status
  const authStatus = await ipcRenderer.invoke('get-auth-status');
  isAuthenticated = authStatus.authenticated;
  
  updateUI();
  setupEventListeners();
}

// Update UI based on authentication
function updateUI() {
  if (isAuthenticated) {
    authSection.style.display = 'none';
    mainContent.style.display = 'block';
    loadActiveFeatures();
  } else {
    authSection.style.display = 'flex';
    mainContent.style.display = 'none';
  }
}

// Setup event listeners
function setupEventListeners() {
  // Login button
  loginBtn.addEventListener('click', () => {
    ipcRenderer.invoke('open-external', 'https://askdunzo.com/api/login');
  });
  
  // Add feature button
  addFeatureBtn.addEventListener('click', () => {
    // This will be handled by the main process to open feature window
    ipcRenderer.send('open-feature-window');
  });
  
  // Settings button
  settingsBtn.addEventListener('click', () => {
    // TODO: Implement settings
    alert('Settings coming soon!');
  });
  
  // Quick action cards
  const actionCards = document.querySelectorAll('.action-card');
  actionCards.forEach(card => {
    card.addEventListener('click', () => {
      const action = card.dataset.action;
      handleQuickAction(action);
    });
  });
}

// Handle quick actions
async function handleQuickAction(action) {
  showLoading(true);
  
  let request = '';
  switch (action) {
    case 'dark-mode':
      request = 'Toggle system-wide dark mode';
      break;
    case 'screenshot':
      request = 'Add screenshot tool with keyboard shortcut';
      break;
    case 'window-manager':
      request = 'Create window management shortcuts';
      break;
    case 'custom':
      // Open feature window for custom request
      ipcRenderer.send('open-feature-window');
      showLoading(false);
      return;
  }
  
  try {
    const result = await ipcRenderer.invoke('generate-feature', {
      request,
      context: { target: 'system' }
    });
    
    if (result.success) {
      applyFeature(result.feature);
    } else {
      showError(result.error);
    }
  } catch (error) {
    showError(error.message);
  }
  
  showLoading(false);
}

// Apply a feature
function applyFeature(feature) {
  // Add to active features
  activeFeatures.push(feature);
  
  // Execute the feature code (in real implementation, this would be sandboxed)
  try {
    eval(feature.code);
    
    // Update UI
    updateFeaturesList();
    showNotification(`Feature "${feature.name}" applied successfully!`);
  } catch (error) {
    showError(`Failed to apply feature: ${error.message}`);
  }
}

// Load active features
function loadActiveFeatures() {
  // TODO: Load from storage
  updateFeaturesList();
}

// Update features list UI
function updateFeaturesList() {
  if (activeFeatures.length === 0) {
    featuresList.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <p>No features added yet</p>
        <p class="text-muted">Click "Add Feature" to get started</p>
      </div>
    `;
  } else {
    featuresList.innerHTML = activeFeatures.map((feature, index) => `
      <div class="feature-item">
        <div class="feature-info">
          <h4>${feature.name}</h4>
          <p>${feature.description}</p>
        </div>
        <div class="feature-controls">
          <button class="btn btn-ghost" onclick="toggleFeature(${index})">
            Toggle
          </button>
          <button class="btn btn-ghost" onclick="removeFeature(${index})">
            Remove
          </button>
        </div>
      </div>
    `).join('');
  }
  
  // Update feature count
  featureCount.textContent = `${activeFeatures.length} features active`;
}

// Toggle feature
function toggleFeature(index) {
  // TODO: Implement feature toggling
  console.log('Toggle feature:', activeFeatures[index]);
}

// Remove feature
function removeFeature(index) {
  activeFeatures.splice(index, 1);
  updateFeaturesList();
  showNotification('Feature removed');
}

// Show loading
function showLoading(show) {
  loading.style.display = show ? 'flex' : 'none';
}

// Show error
function showError(message) {
  // Simple alert for now, could be replaced with better UI
  alert(`Error: ${message}`);
}

// Show notification
function showNotification(message) {
  // Simple notification implementation
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #000;
    color: #fff;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Listen for feature added from feature window
ipcRenderer.on('feature-added', (event, feature) => {
  applyFeature(feature);
});

// Initialize on load
window.addEventListener('DOMContentLoaded', init);