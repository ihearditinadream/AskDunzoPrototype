#!/bin/bash

# Build script for AskDunzo Desktop Application

echo "Building AskDunzo Desktop Application..."

# Create downloads directory
mkdir -p ../client/public/downloads

# Create a simple executable wrapper for demonstration
# In production, this would use electron-packager or electron-builder

# Windows executable stub
cat > ../client/public/downloads/askdunzo-win.exe << 'EOF'
This is a placeholder for the Windows executable.
In production, this would be built with electron-builder.
EOF

# macOS DMG stub
cat > ../client/public/downloads/askdunzo-mac.dmg << 'EOF'
This is a placeholder for the macOS DMG installer.
In production, this would be built with electron-builder.
EOF

# Linux AppImage stub
cat > ../client/public/downloads/askdunzo-linux.AppImage << 'EOF'
This is a placeholder for the Linux AppImage.
In production, this would be built with electron-builder.
EOF

# Package the actual Electron app source for development
tar -czf ../client/public/downloads/askdunzo-desktop-source.tar.gz \
  --exclude="node_modules" \
  --exclude="dist" \
  --exclude="*.sh" \
  *

echo "Desktop app build complete!"
echo "Files created in client/public/downloads/"
ls -la ../client/public/downloads/