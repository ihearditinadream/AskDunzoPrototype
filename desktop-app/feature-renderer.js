const { ipcRenderer } = require('electron');

// DOM Elements
const featureRequest = document.getElementById('feature-request');
const targetSelect = document.getElementById('target-select');
const specificAppInput = document.getElementById('specific-app-input');
const appNameInput = document.getElementById('app-name');
const generateBtn = document.getElementById('generate-btn');
const cancelBtn = document.getElementById('cancel-btn');
const loadingState = document.getElementById('loading-state');
const resultSection = document.getElementById('result-section');
const featureName = document.getElementById('feature-name');
const featureDescription = document.getElementById('feature-description');
const applyBtn = document.getElementById('apply-btn');
const tryAgainBtn = document.getElementById('try-again-btn');
const errorState = document.getElementById('error-state');
const errorMessage = document.querySelector('.error-message');
const retryBtn = document.getElementById('retry-btn');

// State
let currentFeature = null;

// Initialize
function init() {
  setupEventListeners();
  featureRequest.focus();
}

// Setup event listeners
function setupEventListeners() {
  // Target selection change
  targetSelect.addEventListener('change', (e) => {
    if (e.target.value === 'specific-app') {
      specificAppInput.style.display = 'block';
      appNameInput.focus();
    } else {
      specificAppInput.style.display = 'none';
    }
  });
  
  // Generate button
  generateBtn.addEventListener('click', handleGenerate);
  
  // Enter key in textarea
  featureRequest.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleGenerate();
    }
  });
  
  // Cancel button
  cancelBtn.addEventListener('click', () => {
    window.close();
  });
  
  // Apply button
  applyBtn.addEventListener('click', handleApply);
  
  // Try again button
  tryAgainBtn.addEventListener('click', reset);
  
  // Retry button
  retryBtn.addEventListener('click', reset);
}

// Handle generate feature
async function handleGenerate() {
  const request = featureRequest.value.trim();
  
  if (!request) {
    featureRequest.focus();
    return;
  }
  
  // Get target context
  const target = targetSelect.value;
  const context = {
    target,
    appName: target === 'specific-app' ? appNameInput.value.trim() : null
  };
  
  // Show loading
  showSection('loading');
  
  try {
    const result = await ipcRenderer.invoke('generate-feature', {
      request,
      context
    });
    
    if (result.success) {
      currentFeature = result.feature;
      displayResult(result.feature);
    } else {
      showError(result.error || 'Failed to generate feature');
    }
  } catch (error) {
    showError(error.message);
  }
}

// Display result
function displayResult(feature) {
  featureName.textContent = feature.name;
  featureDescription.textContent = feature.description;
  showSection('result');
}

// Handle apply feature
function handleApply() {
  if (!currentFeature) return;
  
  // Send feature to main window
  ipcRenderer.send('feature-added', currentFeature);
  
  // Show success and close
  showNotification('Feature applied successfully!');
  setTimeout(() => {
    window.close();
  }, 1000);
}

// Reset to initial state
function reset() {
  featureRequest.value = '';
  targetSelect.value = 'system';
  appNameInput.value = '';
  specificAppInput.style.display = 'none';
  currentFeature = null;
  showSection('input');
  featureRequest.focus();
}

// Show specific section
function showSection(section) {
  // Hide all sections
  loadingState.style.display = 'none';
  resultSection.style.display = 'none';
  errorState.style.display = 'none';
  
  // Show input elements
  const inputElements = [featureRequest, targetSelect, generateBtn, cancelBtn];
  const showInput = section === 'input';
  
  inputElements.forEach(el => {
    el.disabled = !showInput;
    el.style.opacity = showInput ? '1' : '0.5';
  });
  
  // Show requested section
  switch (section) {
    case 'loading':
      loadingState.style.display = 'block';
      break;
    case 'result':
      resultSection.style.display = 'block';
      break;
    case 'error':
      errorState.style.display = 'block';
      break;
  }
}

// Show error
function showError(message) {
  errorMessage.textContent = message;
  showSection('error');
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #10b981;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideDown 0.3s ease;
  `;
  
  document.body.appendChild(notification);
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      transform: translate(-50%, -100%);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

// Initialize on load
window.addEventListener('DOMContentLoaded', init);