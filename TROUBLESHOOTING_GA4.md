# 🚨 GA4 Not Working - Troubleshooting Guide

## 🔍 **Quick Diagnostic Steps**

### Step 1: Check the Diagnostic Tool
**Open this first:** http://localhost:5173/ga4-debug.html

Look for:
- ✅ Green checkmarks for all system checks
- ✅ gtag function loaded
- ✅ Events appearing in the log when you click test buttons

### Step 2: Check Browser Console
1. Open your dashboard: http://localhost:5173/
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for errors (red text)
5. Check if you see any gtag-related messages

### Step 3: Check Network Tab
1. In Developer Tools, go to **Network** tab
2. Reload the page
3. Filter by "google" or "analytics"
4. You should see requests to:
   - `googletagmanager.com/gtag/js`
   - `google-analytics.com/g/collect`

### Step 4: Verify GA4 Property Settings
1. In Google Analytics, check if:
   - Property ID matches: **12018849689**
   - Measurement ID matches: **G-RK2P8TWPN2**
   - Data stream is active and configured

## 🛠️ **Common Issues & Fixes**

### Issue 1: Ad Blocker
**Symptoms:** No network requests to Google Analytics
**Fix:** 
- Disable ad blockers (uBlock Origin, AdBlock Plus, etc.)
- Whitelist localhost in your ad blocker
- Test in incognito/private browsing mode

### Issue 2: Browser Security Settings
**Symptoms:** Blocked requests, console errors about CORS
**Fix:**
- Try a different browser (Chrome, Firefox, Edge)
- Check if Enhanced Privacy/Tracking Protection is enabled
- Disable strict privacy settings temporarily

### Issue 3: Firewall/Antivirus
**Symptoms:** No outgoing requests, connection timeouts
**Fix:**
- Check if firewall is blocking analytics requests
- Temporarily disable antivirus web protection
- Check corporate/school network restrictions

### Issue 4: GA4 Property Configuration
**Symptoms:** Events sent but not appearing in GA4
**Fix:**
- Verify property is active (not demo/test property)
- Check if data retention settings are configured
- Ensure you're looking at the correct property/view

### Issue 5: Timing Issues
**Symptoms:** Events appear delayed or not at all
**Fix:**
- Real-time data can have 1-2 minute delays
- Try waiting 5-10 minutes and refresh GA4
- Send multiple events to increase visibility

## 🧪 **Manual Testing Steps**

### Test 1: Basic Script Loading
```javascript
// Open browser console and type:
console.log(typeof gtag)
// Should return: "function"

console.log(window.dataLayer)
// Should return: an array with data
```

### Test 2: Manual Event Sending
```javascript
// In browser console, send a test event:
gtag('event', 'manual_test', {
  event_category: 'debug',
  event_label: 'console_test',
  value: 42
})
```

### Test 3: Check DataLayer
```javascript
// Check what's in the data layer:
console.log(JSON.stringify(window.dataLayer, null, 2))
// Should show gtag configuration and events
```

## 🔧 **Advanced Debugging**

### Enable GA4 Debug Mode
Add this to your browser console:
```javascript
gtag('config', 'G-RK2P8TWPN2', {
  debug_mode: true
})
```

### Check Real-Time API
Use GA4's Real-Time Reporting API debugger:
https://ga-dev-tools.google/ga4/realtime-report/

### Validate Measurement ID
Double-check in Google Analytics:
1. Admin → Data Streams → Web → Your Stream
2. Copy the Measurement ID exactly

## 📞 **Still Not Working?**

If none of the above works, let's check:

1. **What browser are you using?**
2. **Any console errors when you open http://localhost:5173/?**
3. **Does the diagnostic tool show all green checkmarks?**
4. **Are you connected to corporate/school network with restrictions?**
5. **Any antivirus or security software running?**

### Quick Test Commands
```bash
# Check if server is running
curl -I http://localhost:5173/

# Test if GA4 script loads
curl -I https://www.googletagmanager.com/gtag/js?id=G-RK2P8TWPN2
```

### Emergency Fallback
If nothing works, we can:
1. Switch to a different Measurement ID
2. Use GA4's debug view instead of real-time
3. Set up Google Tag Manager instead of direct gtag
4. Use a different analytics provider temporarily

**Let me know what you see in the diagnostic tool and browser console!** 🔍
