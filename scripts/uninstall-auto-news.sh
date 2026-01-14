#!/bin/bash

# Uninstall automatic news updates
# This script removes the launchd job

echo "🗑️  GIDI NEWS AUTO-UPDATE UNINSTALL"
echo "===================================="
echo ""

LAUNCH_AGENTS_DIR="$HOME/Library/LaunchAgents"
PLIST_FILE="$LAUNCH_AGENTS_DIR/com.gidiconnect.newsagent.plist"

if [ -f "$PLIST_FILE" ]; then
    echo "📋 Unloading launchd job..."
    launchctl unload "$PLIST_FILE" 2>/dev/null

    echo "🗑️  Removing plist file..."
    rm "$PLIST_FILE"

    echo ""
    echo "✅ AUTO-UPDATE UNINSTALLED SUCCESSFULLY!"
    echo ""
    echo "   The news agent will no longer run automatically."
    echo "   You can still run it manually with: npm run news-agent"
    echo ""
else
    echo "⚠️  No auto-update installation found."
    echo ""
fi
