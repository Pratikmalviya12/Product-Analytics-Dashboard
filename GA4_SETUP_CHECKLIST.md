# ✅ GA4 Data API Setup Checklist

## 📋 **Step-by-Step Checklist**

### **Google Cloud Console Setup**
- [ ] Go to: https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com
- [ ] Click **"Enable"** on Google Analytics Data API
- [ ] Go to: https://console.cloud.google.com/apis/credentials
- [ ] Click **"Create Credentials"** → **"Service Account"**
- [ ] Name: `analytics-dashboard-reader`
- [ ] Role: **"Viewer"**
- [ ] Create and download **JSON key file**

### **Google Analytics Setup**
- [ ] Go to: https://analytics.google.com
- [ ] Go to **Admin** → **Property Access Management**
- [ ] Click **"+"** to add user
- [ ] Add service account email from JSON file
- [ ] Role: **"Viewer"**

### **Dashboard Configuration**
- [ ] Open: http://localhost:5173/
- [ ] Scroll to **"Data Source Configuration"**
- [ ] Click **"Setup GA4"**
- [ ] Enter Property ID: `12018849689`
- [ ] Upload JSON file
- [ ] Click **"Test Connection"**
- [ ] Switch to **"Google Analytics 4"** data source

---

## 🔧 **Your GA4 Details**
- **Measurement ID**: `G-RK2P8TWPN2`
- **Property ID**: `12018849689`
- **Stream Name**: Test Website
- **Stream URL**: https://google.com

---

## 🆘 **If You Get Stuck**

### **Common Issues:**
1. **"API not enabled"** → Make sure you enabled Google Analytics Data API
2. **"Access denied"** → Make sure you added service account to GA4 property
3. **"Invalid JSON"** → Make sure you downloaded the correct service account key
4. **"Property not found"** → Double-check Property ID is `12018849689`

### **Test Commands:**
```bash
# Check if your dashboard is running
curl -I http://localhost:5173/

# Verify your Property ID in browser console
# Go to your dashboard, press F12, and type:
console.log('Property ID should be: 12018849689')
```

---

## 🎉 **Success Indicators**

You'll know it's working when:
- ✅ **"Test Connection"** shows success message
- ✅ **Data source switches** to "Google Analytics 4"
- ✅ **Real data appears** in your charts (instead of simulated)
- ✅ **KPI numbers change** to reflect actual website traffic
- ✅ **Real-time panel** shows actual website activity

---

## 📞 **Need Help?**

If you encounter any issues:
1. Check the **browser console** for error messages (F12)
2. Verify the **service account email** is added to GA4
3. Confirm the **JSON file** is valid and from the correct service account
4. Make sure **Property ID** matches exactly: `12018849689`

**Once this is set up, your dashboard will show real website analytics data just like Google Analytics!** 🚀
