#!/bin/bash

# Exit immediately if a command fails
set -e
set +o pipefail

# Get the environment from arguments (default: Dev)
ENVIRONMENT=${1:-"Production"} # Environment name (e.g., Dev, Staging, Production)
TEAM_ID=${2} # Team ID for code signing
ALLOW_EXPORT=${3:-false} # Optional parameter to enable IPA export


# Check if TEAM_ID is provided
if [[ -z "$TEAM_ID" ]]; then
  echo "❌ ERROR: Team ID is required!"
  echo "Usage: ./ios-build.sh <ENVIRONMENT> <TEAM_ID>"
  echo "Example: ./ios-build.sh Dev ABCDEFGHIJ"
  exit 1
fi

# check if the environment is empty and set it to Production
if [[ -z "$ENVIRONMENT" ]]; then
  echo "❌ ERROR: No environment specified, Environment is required!"
  exit 1
fi

# check if the environment is empty and set it to Production
if [[ "$ENVIRONMENT" == "Production" ]]; then
  echo "⚠️ Production build detected, setting code signing identity to 'Apple Distribution'"
  ENVIRONMENT=""
  ALLOW_EXPORT=false
fi

# Define project and scheme names dynamically
PROJECT_BASE_NAME="aispec" # Base project name or App name
PROJECT_NAME="${PROJECT_BASE_NAME}${ENVIRONMENT}"
SCHEME_NAME="${PROJECT_BASE_NAME}${ENVIRONMENT}"

ARCHIVE_PATH="./ios/build/${PROJECT_NAME}.xcarchive"
EXPORT_PATH="./ios/build"
EXPORT_OPTIONS_PLIST="./ios/ExportOptions.plist"

# Remember the project root directory
ROOT_DIR=$(pwd)

echo "🚀 Starting iOS Archive Build..."
echo "📱 Environment: $ENVIRONMENT"
echo "🔑 Team ID: $TEAM_ID"
echo "📋 Project: $PROJECT_NAME"
echo "🎯 Scheme: $SCHEME_NAME"
echo "📂 Project root: $ROOT_DIR"
echo "📦 Export enabled: $ALLOW_EXPORT"

# Step 1: Verify React Native installation
echo "🔍 Verifying React Native installation..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "⚠️ node_modules not found, installing dependencies..."
  npm install
fi

# Verify React Native package.json exists
if [ ! -f "node_modules/react-native/package.json" ]; then
  echo "❌ ERROR: React Native package.json not found. Your project setup may be incorrect."
  exit 1
fi

echo "✅ React Native installation verified."

# Step 2: Clean and prepare the environment
echo "🧹 Cleaning and preparing environment..."

# Clear React Native caches
echo "🗑️ Clearing React Native caches..."
watchman watch-del-all 2>/dev/null || echo "Watchman not installed or failed"
rm -rf $TMPDIR/react-* 2>/dev/null || echo "No React cache to clean"
rm -rf $TMPDIR/metro-* 2>/dev/null || echo "No Metro cache to clean"

# Clean Xcode DerivedData
echo "🗑️ Cleaning Xcode derived data for this project..."
rm -rf ~/Library/Developer/Xcode/DerivedData/*${PROJECT_BASE_NAME}*

# Step 3: Update Podfile if needed
echo "📝 Checking Podfile configuration..."
cd ios

# Make backup of Podfile
cp Podfile Podfile.backup

# Check if Podfile needs to be modified
if grep -q "use_react_native!" Podfile; then
  echo "🔧 Updating React Native path in Podfile..."
  # Create a temporary file with the correct path
  cat Podfile | sed "s|use_react_native!(|use_react_native!(\n  :path => \"$ROOT_DIR/node_modules/react-native\",|g" > Podfile.temp
  
  # Check if the modification worked, only replace if it did
  if grep -q ":path => \"$ROOT_DIR/node_modules/react-native\"" Podfile.temp; then
    mv Podfile.temp Podfile
    echo "✅ Podfile updated with correct React Native path."
  else
    # If the sed command didn't work as expected, restore from backup
    rm Podfile.temp
    echo "⚠️ Automatic Podfile update failed. Please update the React Native path manually."
  fi
fi

# Step 4: Clean and reinstall pods
echo "♻️ Reinstalling CocoaPods..."
rm -rf Pods
rm -rf Podfile.lock
pod cache clean --all

# Create a symbolic link to node_modules if needed
echo "🔗 Ensuring node_modules is accessible from iOS directory..."
if [ ! -d "node_modules" ] && [ -d "$ROOT_DIR/node_modules" ]; then
  ln -sf "$ROOT_DIR/node_modules" .
  echo "✅ Created symbolic link to node_modules"
fi

# Before pod install
echo "⚠️ Ignoring Hermes script phase warning..."

# Run pod install with more information
echo "♻️ Running pod install..."
pod install --repo-update --verbose 2>&1 | tee pod-install.log | grep -v "\[!] hermes-engine"

# Step 5: Prepare ExportOptions.plist if export is enabled
if [ "$ALLOW_EXPORT" = "true" ]; then
  echo "📝 Checking ExportOptions.plist..."
  if [ ! -f "$EXPORT_OPTIONS_PLIST" ]; then
    echo "🔧 Creating ExportOptions.plist..."
    
    # Create directory if it doesn't exist
    mkdir -p "$(dirname "$EXPORT_OPTIONS_PLIST")"
    
    # Determine bundle identifier from project settings
    BUNDLE_ID=$(xcodebuild -project "${PROJECT_NAME}.xcodeproj" -target "${SCHEME_NAME}" -showBuildSettings | grep "PRODUCT_BUNDLE_IDENTIFIER" | sed 's/.*= //')
    
    # Create ExportOptions.plist with development distribution method by default
    cat > "$EXPORT_OPTIONS_PLIST" << EOL
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>development</string>
    <key>teamID</key>
    <string>${TEAM_ID}</string>
    <key>compileBitcode</key>
    <false/>
    <key>provisioningProfiles</key>
    <dict>
        <key>${BUNDLE_ID}</key>
        <string>iOS Team Provisioning Profile: ${BUNDLE_ID}</string>
    </dict>
</dict>
</plist>
EOL
    echo "✅ Created ExportOptions.plist with development configuration."
  else
    echo "✅ ExportOptions.plist already exists."
  fi
fi

# Step 6: Run the archive command
echo "📦 Archiving the iOS project..."

xcodebuild archive -workspace "${PROJECT_NAME}.xcworkspace" \
    -scheme "${SCHEME_NAME}" \
    -destination generic/platform=iOS \
    -archivePath "$ARCHIVE_PATH" \
    -configuration Release \
    CODE_SIGN_STYLE=Automatic \
    DEVELOPMENT_TEAM="${TEAM_ID}" \
    ARCHS="arm64" \
    -allowProvisioningUpdates

echo "✅ Archive created successfully at: $ARCHIVE_PATH"

# Export IPA (optional)
if [ -f "$EXPORT_OPTIONS_PLIST" ]; then
  echo "📤 Exporting IPA file..."
  xcodebuild -exportArchive \
    -archivePath "$ARCHIVE_PATH" \
    -exportPath "$EXPORT_PATH" \
    -exportOptionsPlist "$EXPORT_OPTIONS_PLIST"
  
  echo "✅ IPA exported to: $EXPORT_PATH"
else
  echo "⚠️ Skipping IPA export (ExportOptions.plist not found)"
fi

# Restore original Podfile if we modified it
if [ -f "Podfile.backup" ]; then
  echo "🔄 Restoring original Podfile..."
  mv Podfile.backup Podfile
fi

# Remove symbolic link if we created one
if [ -L "node_modules" ]; then
  echo "🧹 Removing temporary symbolic link..."
  rm node_modules
fi

echo "🎉 iOS $ENVIRONMENT Build Process Completed!"