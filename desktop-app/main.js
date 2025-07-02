const { app, BrowserWindow, Menu, Tray, ipcMain, dialog, shell } = require('electron');
const path = require('path');

let mainWindow;
let tray;
let featureWindow;

// API endpoint
const API_BASE_URL = 'https://askdunzo.com/api';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    title: 'AskDunzo - Keep I.T. Simple'
  });

  // Load the main UI
  mainWindow.loadFile('index.html');

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createFeatureWindow() {
  if (featureWindow) {
    featureWindow.focus();
    return;
  }

  featureWindow = new BrowserWindow({
    width: 500,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    title: 'Add New Feature',
    resizable: false,
    alwaysOnTop: true
  });

  featureWindow.loadFile('feature.html');

  featureWindow.on('closed', () => {
    featureWindow = null;
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, 'assets', 'tray-icon.png'));
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Add Feature',
      click: () => createFeatureWindow()
    },
    {
      label: 'Show AskDunzo',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        } else {
          createWindow();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Settings',
      click: () => {
        if (mainWindow) {
          mainWindow.webContents.send('navigate', '/settings');
          mainWindow.show();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setToolTip('AskDunzo - Transform your PC');
  tray.setContextMenu(contextMenu);
  
  // Double click to show main window
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    } else {
      createWindow();
    }
  });
}

// App event handlers
app.whenReady().then(() => {
  createWindow();
  createTray();

  // Set up global shortcut for quick access
  const { globalShortcut } = require('electron');
  globalShortcut.register('CommandOrControl+Shift+D', () => {
    createFeatureWindow();
  });
});

app.on('window-all-closed', () => {
  // Keep app running in tray on Windows/Linux
  if (process.platform !== 'darwin') {
    // Don't quit, keep in tray
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC handlers for feature generation
ipcMain.handle('generate-feature', async (event, { request, context }) => {
  try {
    // For now, return mock features
    // TODO: Integrate with actual API when authentication is set up
    
    const lowerRequest = request.toLowerCase();
    
    if (lowerRequest.includes('dark mode') || lowerRequest.includes('dark theme')) {
      return {
        success: true,
        feature: {
          name: 'System Dark Mode',
          description: 'Toggle dark mode across your entire system',
          type: 'system',
          code: `
// This would normally execute system-level code
// For demo purposes, showing what would happen
console.log('Toggling system dark mode...');
alert('Dark mode feature would be applied system-wide!');
          `
        }
      };
    }
    
    if (lowerRequest.includes('screenshot') || lowerRequest.includes('screen capture')) {
      return {
        success: true,
        feature: {
          name: 'Quick Screenshot',
          description: 'Take screenshots with a keyboard shortcut',
          type: 'system',
          code: `
// This would set up a global hotkey for screenshots
console.log('Setting up screenshot hotkey...');
alert('Screenshot feature would be added with Ctrl+Shift+S hotkey!');
          `
        }
      };
    }
    
    return {
      success: true,
      feature: {
        name: 'Custom Feature',
        description: request,
        type: 'custom',
        code: `
console.log('Processing: ${request}');
alert('This feature requires AI processing. Connect your API key to enable it!');
        `
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});

ipcMain.handle('get-auth-status', async () => {
  // TODO: Implement actual authentication
  return {
    authenticated: false,
    subscription: null
  };
});

ipcMain.handle('open-external', async (event, url) => {
  shell.openExternal(url);
});

// Menu setup
const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Feature',
        accelerator: 'CommandOrControl+N',
        click: () => createFeatureWindow()
      },
      { type: 'separator' },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click: () => app.quit()
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Documentation',
        click: () => shell.openExternal('https://askdunzo.com/docs')
      },
      {
        label: 'Report Issue',
        click: () => shell.openExternal('https://askdunzo.com/support')
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);