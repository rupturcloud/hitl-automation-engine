# Deployment Guide - Will Dados Pro v1.0

## Quick Start

### 1. Load Extension in Chrome

```bash
# Open Chrome and navigate to:
chrome://extensions/

# Enable "Developer mode" (top right)
# Click "Load unpacked"
# Select: /Users/diego/dev/ruptur-cloud/cs/will/will-dados-pro/prod/v0/wdp-extension-v0
```

### 2. Verify Installation

After loading:
- Extension should appear in extensions list
- Icon appears in Chrome toolbar
- Popup opens when icon is clicked
- Options page accessible from right-click menu

### 3. Configure Settings

Click extension icon → Click "Options" to set:
- Proxy configuration
- Betting parameters
- Calibration settings
- Logging preferences

## File Structure

```
prod/v0/
├── wdp-extension-v0/              # Main extension directory
│   ├── manifest.json              # Extension configuration
│   ├── background.js              # Service worker (lifecycle)
│   ├── content.js                 # DOM interaction layer
│   ├── popup.html/js              # Extension popup UI
│   ├── options.html/js            # Settings page
│   ├── sidepanel.html/js          # Extended dashboard
│   ├── overlay.html               # Game page overlay
│   │
│   ├── lib/
│   │   └── will-dados-robo.js     # Core game automation logic
│   │
│   ├── chipCalibrator.js          # Game state detection
│   ├── realizarAposta.js          # Betting executor
│   ├── sessionMonitor.js          # Connection lifecycle
│   ├── keepAliveClicker.js        # Session persistence
│   │
│   ├── proxyIntelligence.js       # Smart proxy selection
│   ├── proxyValidator.js          # Connection validation
│   └── ws-bridge.js               # WebSocket bridge
│
├── README.md                      # Project overview
├── ARCHITECTURE.md                # Technical design
├── DEPLOYMENT_GUIDE.md            # This file
└── .gitignore                     # Git exclusions
```

## Production Checklist

### Code Quality
- ✅ All test files removed
- ✅ Development comments cleaned
- ✅ Console.debug() statements removed
- ✅ Error handling implemented
- ✅ Security review completed

### Configuration
- ✅ manifest.json optimized for production
- ✅ Version bumped to 1.0.0
- ✅ Description clarified
- ✅ Permissions validated

### Testing
Before deployment:
1. Test on fresh Chrome profile
2. Verify proxy functionality
3. Test betting scenarios
4. Monitor console for errors
5. Check memory usage

### Monitoring

After deployment, monitor:
```
- Extension crashes: chrome://extensions/ errors section
- Proxy failures: Check extension console
- Betting failures: Sidepanel statistics
- Connection stability: Session monitor logs
```

## Troubleshooting

### Extension won't load
- Verify manifest.json is valid JSON
- Check all referenced files exist
- Clear Chrome cache and reload

### Proxy not connecting
- Verify credentials in options
- Test with different proxy
- Check firewall/network settings

### Betting not executing
- Verify game page is compatible
- Check selector version in options
- Review console for error messages

### High memory usage
- Check for console spam
- Verify session monitor interval
- Clear old cache entries

## API Reference

### Message Format (Content → Background)
```javascript
{
  action: "actionName",
  data: { /* context-specific data */ },
  timestamp: Date.now()
}
```

### Response Format
```javascript
{
  success: boolean,
  result: { /* action result */ },
  error: string, // null if successful
  executionTime: number // ms
}
```

## Support & Documentation

- **README.md** - Project overview and features
- **ARCHITECTURE.md** - Technical design and patterns
- **manifest.json** - Extension configuration
- **Chrome DevTools** - Debug with F12

## Version History

### v1.0.0 (Current)
- Production release
- Proxy intelligence implementation
- Session management framework
- Multi-platform support

## Security Notes

⚠️ **Important:**
- Never commit proxy credentials to git
- Use chrome.storage.local for secrets only
- Validate all user input before use
- Regular security audits recommended
- Update Chrome extensions regularly

## License

Implementation for authorized use only.

---

**Last Updated:** May 2026  
**Maintained By:** Will Dados Development Team
