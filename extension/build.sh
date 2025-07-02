#!/bin/bash

# Build script for AskDunzo Chrome Extension

echo "Building AskDunzo Chrome Extension..."

# Create build directory
mkdir -p ../public/downloads

# Remove old build if exists
rm -f ../public/downloads/askdunzo-extension.zip

# Create zip file with all extension files
zip -r ../public/downloads/askdunzo-extension.zip * -x "*.sh" -x "*.md" -x "icons/original-logo.jpg"

echo "Extension built successfully!"
echo "Output: public/downloads/askdunzo-extension.zip"