#!/bin/bash

# Setup automatic news updates every 3 hours
# This script installs a launchd job for macOS

echo "🤖 GIDI NEWS AUTO-UPDATE SETUP"
echo "================================"
echo ""

# Find the actual node path
NODE_PATH=$(which node)
if [ -z "$NODE_PATH" ]; then
    echo "❌ Error: Node.js not found in PATH"
    echo "   Please make sure Node.js is installed"
    exit 1
fi

echo "✅ Found Node.js at: $NODE_PATH"

# Update the plist file with the correct node path
PLIST_FILE="/Users/femimoritiwon/gidi-vibe-connect-1/com.gidiconnect.newsagent.plist"
TEMP_PLIST="/tmp/com.gidiconnect.newsagent.plist"

# Replace the node path in the plist
sed "s|/usr/local/bin/node|$NODE_PATH|g" "$PLIST_FILE" > "$TEMP_PLIST"

# Copy to LaunchAgents directory
LAUNCH_AGENTS_DIR="$HOME/Library/LaunchAgents"
mkdir -p "$LAUNCH_AGENTS_DIR"

echo "📋 Installing launchd job..."
cp "$TEMP_PLIST" "$LAUNCH_AGENTS_DIR/com.gidiconnect.newsagent.plist"

# Load the job
launchctl unload "$LAUNCH_AGENTS_DIR/com.gidiconnect.newsagent.plist" 2>/dev/null
launchctl load "$LAUNCH_AGENTS_DIR/com.gidiconnect.newsagent.plist"

echo ""
echo "✅ AUTO-UPDATE INSTALLED SUCCESSFULLY!"
echo ""
echo "📊 Configuration:"
echo "   • Runs every: 3 hours"
echo "   • First run: Immediately"
echo "   • Logs: /Users/femimoritiwon/gidi-vibe-connect-1/logs/news-agent.log"
echo "   • Errors: /Users/femimoritiwon/gidi-vibe-connect-1/logs/news-agent-error.log"
echo ""
echo "📝 To check status:"
echo "   launchctl list | grep gidiconnect"
echo ""
echo "📝 To view logs:"
echo "   tail -f /Users/femimoritiwon/gidi-vibe-connect-1/logs/news-agent.log"
echo ""
echo "📝 To uninstall:"
echo "   bash scripts/uninstall-auto-news.sh"
echo ""
