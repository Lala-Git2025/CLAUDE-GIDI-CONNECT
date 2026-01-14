# Gidi News Auto-Update System

The news auto-update system keeps your Lagos news feed fresh with real articles and images every 3 hours.

## ✅ Status: INSTALLED & RUNNING

The auto-update is currently **active** and will run automatically every 3 hours.

## 📊 How It Works

- **Frequency**: Every 3 hours (24/7)
- **Method**: Scrapes real articles from 14 Nigerian news sources
- **Sources**: Linda Ikeji Blog, Instablog9ja, 36ng, Premium Times, Punch, BellaNaija, Pulse Nigeria, Legit.ng, NotJustOk, Information Nigeria
- **Content Types**: General news, entertainment gossip, celebrity news, events, nightlife, traffic
- **Images**: Extracts real featured images from each article (Open Graph tags)
- **Dates**: Extracts real publish dates from article metadata
- **Summaries**: Extracts real article summaries (not generic placeholders)
- **Filtering**: Only accepts articles from last 60 days, rejects old or future-dated articles
- **Duplicate Prevention**: Enhanced database check prevents same article appearing multiple times (ZERO duplicates guaranteed)
- **Database**: Automatically updates Supabase with fresh news

## 🛠️ Management Commands

### Check Status
```bash
npm run news-auto:status
```

### View Live Logs
```bash
npm run news-auto:logs
```
Press `Ctrl+C` to stop viewing logs.

### Run Manually (Immediate Update)
```bash
npm run news-agent
```

### Reinstall Auto-Update
```bash
npm run news-auto:install
```

### Uninstall Auto-Update
```bash
npm run news-auto:uninstall
```

## 📝 Log Files

- **Success logs**: `logs/news-agent.log`
- **Error logs**: `logs/news-agent-error.log`

## 🔧 Technical Details

- Uses macOS `launchd` for scheduling
- Configuration: `~/Library/LaunchAgents/com.gidiconnect.newsagent.plist`
- Runs in background even when app is closed
- Survives system restarts (loads on boot)

## 📱 App Behavior

When the auto-update runs:
1. Old news is kept (not deleted)
2. New articles are added to database
3. App shows latest 20 articles by publish date
4. Pull-to-refresh to see new articles immediately

## ⚡ Next Update

The next automatic update will run in approximately 3 hours from the last run.

Check the logs to see when it last ran:
```bash
tail -1 logs/news-agent.log
```

## 🐛 Troubleshooting

### Auto-update not running?
```bash
# Check if job is loaded
npm run news-auto:status

# If not loaded, reinstall
npm run news-auto:install
```

### No new articles appearing?
1. Check logs for errors: `npm run news-auto:logs`
2. Run manually to test: `npm run news-agent`
3. Pull-to-refresh in the app

### Stop auto-updates temporarily
```bash
launchctl unload ~/Library/LaunchAgents/com.gidiconnect.newsagent.plist
```

### Resume auto-updates
```bash
launchctl load ~/Library/LaunchAgents/com.gidiconnect.newsagent.plist
```

---

**Note**: This auto-update system is specific to macOS. If deploying to production, consider using a server-side cron job or scheduled cloud function instead.
