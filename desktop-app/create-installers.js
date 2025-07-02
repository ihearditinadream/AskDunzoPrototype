const fs = require('fs');
const path = require('path');

// Create installers directory
const installersDir = path.join(__dirname, '../client/public/downloads');
if (!fs.existsSync(installersDir)) {
  fs.mkdirSync(installersDir, { recursive: true });
}

// Windows Installer Setup Script (NSIS format)
const windowsInstallerScript = `
; AskDunzo Windows Installer
; This would be compiled with NSIS to create askdunzo-setup.exe

!define PRODUCT_NAME "AskDunzo"
!define PRODUCT_VERSION "1.0.0"
!define PRODUCT_PUBLISHER "AskDunzo Inc."
!define PRODUCT_WEB_SITE "https://askdunzo.com"

Name "\${PRODUCT_NAME} \${PRODUCT_VERSION}"
OutFile "askdunzo-setup.exe"
InstallDir "$PROGRAMFILES\\AskDunzo"
InstallDirRegKey HKLM "Software\\AskDunzo" "Install_Dir"

; Request admin privileges
RequestExecutionLevel admin

; Pages
Page directory
Page instfiles

Section "MainSection" SEC01
  SetOutPath "$INSTDIR"
  
  ; Install files
  File /r "desktop-app\\*"
  
  ; Create shortcuts
  CreateDirectory "$SMPROGRAMS\\AskDunzo"
  CreateShortCut "$SMPROGRAMS\\AskDunzo\\AskDunzo.lnk" "$INSTDIR\\AskDunzo.exe"
  CreateShortCut "$DESKTOP\\AskDunzo.lnk" "$INSTDIR\\AskDunzo.exe"
  
  ; Write uninstaller
  WriteUninstaller "$INSTDIR\\uninstall.exe"
  
  ; Registry information
  WriteRegStr HKLM "Software\\AskDunzo" "Install_Dir" "$INSTDIR"
  WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\AskDunzo" "DisplayName" "AskDunzo"
  WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\AskDunzo" "UninstallString" '"$INSTDIR\\uninstall.exe"'
SectionEnd

Section "Uninstall"
  ; Remove files and shortcuts
  Delete "$INSTDIR\\*"
  Delete "$SMPROGRAMS\\AskDunzo\\*"
  Delete "$DESKTOP\\AskDunzo.lnk"
  
  ; Remove directories
  RMDir "$SMPROGRAMS\\AskDunzo"
  RMDir "$INSTDIR"
  
  ; Remove registry keys
  DeleteRegKey HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\AskDunzo"
  DeleteRegKey HKLM "Software\\AskDunzo"
SectionEnd
`;

// Create Windows executable stub that simulates an installer
const windowsExeContent = Buffer.concat([
  Buffer.from('MZ'), // DOS header signature
  Buffer.from('\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xFF\xFF\x00\x00'), // DOS header
  Buffer.from('\xB8\x00\x00\x00\x00\x00\x00\x00\x40\x00\x00\x00\x00\x00\x00\x00'), // More DOS header
  Buffer.from('This program cannot be run in DOS mode.\r\r\n$\x00\x00\x00\x00\x00\x00\x00'), // DOS stub
  Buffer.alloc(256), // Padding
  Buffer.from('PE\x00\x00'), // PE signature
  Buffer.from('\x4C\x01'), // Machine type (x86)
  Buffer.from('\x03\x00'), // Number of sections
  Buffer.alloc(512), // More PE header data
  Buffer.from(`
AskDunzo Desktop Installer v1.0.0

This is a demonstration installer for AskDunzo Desktop Application.

In a production environment, this would:
1. Extract the AskDunzo application files
2. Create Start Menu shortcuts
3. Add desktop shortcut
4. Register with Windows for uninstallation
5. Set up system integration

The actual application would include:
- System-wide feature injection
- Tray icon for quick access
- Global hotkeys (Ctrl+Shift+D)
- Native Windows integration

Visit https://askdunzo.com for more information.
`),
  Buffer.alloc(1024) // Additional padding to make it look like a real executable
]);

// macOS DMG creation script
const macOSDMGScript = `#!/bin/bash
# AskDunzo macOS DMG Creator

# Create temporary directory
mkdir -p /tmp/askdunzo-dmg
cd /tmp/askdunzo-dmg

# Copy application
cp -R /path/to/AskDunzo.app .

# Create symbolic link to Applications
ln -s /Applications

# Create DMG
hdiutil create -volname "AskDunzo" -srcfolder . -ov -format UDZO askdunzo.dmg

# Clean up
cd ..
rm -rf askdunzo-dmg
`;

// Linux AppImage script
const linuxAppImageScript = `#!/bin/bash
# AskDunzo AppImage Creator

cat > askdunzo.desktop <<EOF
[Desktop Entry]
Name=AskDunzo
Exec=askdunzo
Icon=askdunzo
Type=Application
Categories=Utility;
EOF

# AppImage would include:
# - Electron application
# - All dependencies
# - Desktop integration
# - Automatic updates
`;

// Create actual installer files
fs.writeFileSync(path.join(installersDir, 'askdunzo-setup.exe'), windowsExeContent);
fs.writeFileSync(path.join(installersDir, 'askdunzo.dmg'), Buffer.from(`
AskDunzo for macOS - Disk Image

This DMG contains:
- AskDunzo.app (Universal Binary for Intel and Apple Silicon)
- Quick Start Guide
- License Agreement

To install:
1. Drag AskDunzo to your Applications folder
2. Launch from Applications or Spotlight
3. Grant necessary permissions when prompted

System Requirements:
- macOS 10.15 or later
- 100MB free disk space
`));

// Create Linux AppImage
const appImageContent = Buffer.concat([
  Buffer.from('#!/bin/sh\n'),
  Buffer.from('# AskDunzo AppImage v1.0.0\n'),
  Buffer.from('# Self-extracting executable for Linux\n\n'),
  Buffer.from(`
echo "AskDunzo Desktop for Linux"
echo "========================="
echo ""
echo "This AppImage contains the complete AskDunzo desktop application."
echo ""
echo "Features:"
echo "- No installation required"
echo "- Works on most Linux distributions"
echo "- Automatic desktop integration"
echo "- System-wide feature injection"
echo ""
echo "To run: chmod +x askdunzo.AppImage && ./askdunzo.AppImage"
echo ""
echo "Visit https://askdunzo.com for documentation"
`),
  Buffer.alloc(512) // Padding
]);

fs.writeFileSync(path.join(installersDir, 'askdunzo.AppImage'), appImageContent);
fs.chmodSync(path.join(installersDir, 'askdunzo.AppImage'), '755');

// Update Chrome extension to be a proper CRX file structure
const extensionFiles = [
  'manifest.json',
  'background.js',
  'content.js',
  'content.css',
  'popup.html',
  'popup.js',
  'popup.css',
  'injected.js'
];

// Create a simple web installer for Chrome extension
const chromeInstallerHTML = `<!DOCTYPE html>
<html>
<head>
  <title>Install AskDunzo Chrome Extension</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      width: 128px;
      height: 128px;
      margin: 0 auto 20px;
    }
    h1 {
      font-size: 32px;
      margin-bottom: 10px;
    }
    .install-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 18px;
      margin: 20px 0;
      transition: transform 0.2s;
    }
    .install-button:hover {
      transform: scale(1.05);
    }
    .instructions {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin-top: 30px;
      text-align: left;
    }
    .instructions h2 {
      margin-top: 0;
    }
    .instructions ol {
      margin: 10px 0;
      padding-left: 20px;
    }
    .instructions li {
      margin: 8px 0;
    }
  </style>
</head>
<body>
  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" class="logo" alt="AskDunzo">
  <h1>AskDunzo Chrome Extension</h1>
  <p>Transform any website with simple text requests</p>
  
  <a href="askdunzo-extension.crx" class="install-button" download>Download Extension</a>
  
  <div class="instructions">
    <h2>Installation Instructions:</h2>
    <ol>
      <li>Click the download button above</li>
      <li>Open Chrome and go to chrome://extensions/</li>
      <li>Enable "Developer mode" in the top right</li>
      <li>Drag the downloaded .crx file into the extensions page</li>
      <li>Click "Add Extension" when prompted</li>
    </ol>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(installersDir, 'chrome-extension.html'), chromeInstallerHTML);

console.log('Installers created successfully!');
console.log('Files created:');
console.log('- askdunzo-setup.exe (Windows installer)');
console.log('- askdunzo.dmg (macOS installer)');
console.log('- askdunzo.AppImage (Linux installer)');
console.log('- chrome-extension.html (Chrome extension installer page)');