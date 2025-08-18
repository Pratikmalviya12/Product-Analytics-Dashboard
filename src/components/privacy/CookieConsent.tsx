import React from 'react';
import { analytics } from '../../services/analytics';

interface CookieConsentProps {
  onConsentGiven?: (consented: boolean) => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ onConsentGiven }) => {
  const [showBanner, setShowBanner] = React.useState(false);
  const [consentGiven, setConsentGiven] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    // Check if user has already given consent
    const storedConsent = localStorage.getItem('ga4-consent');
    if (storedConsent === null) {
      setShowBanner(true);
    } else {
      const consented = storedConsent === 'granted';
      setConsentGiven(consented);
      
      // Configure analytics based on stored consent
      if (consented) {
        analytics.enableAnalytics();
      } else {
        analytics.disableAnalytics();
      }
    }
  }, []);

  const handleAccept = () => {
    setConsentGiven(true);
    setShowBanner(false);
    localStorage.setItem('ga4-consent', 'granted');
    
    // Enable Google Analytics
    analytics.enableAnalytics();
    
    // Initialize gtag consent
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
    
    onConsentGiven?.(true);
  };

  const handleDecline = () => {
    setConsentGiven(false);
    setShowBanner(false);
    localStorage.setItem('ga4-consent', 'denied');
    
    // Disable Google Analytics
    analytics.disableAnalytics();
    
    // Update gtag consent
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
    
    onConsentGiven?.(false);
  };

  const resetConsent = () => {
    localStorage.removeItem('ga4-consent');
    setConsentGiven(null);
    setShowBanner(true);
  };

  if (!showBanner) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={resetConsent}
          className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded-md transition-colors"
          title="Manage cookie preferences"
        >
          🍪 Cookie Settings
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              🍪 We Value Your Privacy
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              This website uses Google Analytics to help us understand how visitors interact with our dashboard. 
              We collect anonymized data about page views, user interactions, and performance metrics. 
              You can choose to accept or decline analytics tracking.
            </p>
            <div className="mt-2">
              <details className="text-xs text-gray-500 dark:text-gray-400">
                <summary className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-200">
                  What data do we collect?
                </summary>
                <div className="mt-2 pl-4">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Page views and navigation patterns</li>
                    <li>Button clicks and feature usage</li>
                    <li>Dashboard filter and chart interactions</li>
                    <li>Session duration and bounce rate</li>
                    <li>Device type and browser information</li>
                    <li>Geographic location (country level only)</li>
                  </ul>
                  <p className="mt-2 font-medium">
                    We do NOT collect: Personal information, IP addresses, or any data that can identify you personally.
                  </p>
                </div>
              </details>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDecline}
              className="px-6 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Accept Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Privacy dashboard component
export const PrivacyDashboard: React.FC = () => {
  const [consentStatus, setConsentStatus] = React.useState<string | null>(null);

  React.useEffect(() => {
    const consent = localStorage.getItem('ga4-consent');
    setConsentStatus(consent);
  }, []);

  const toggleConsent = () => {
    const newStatus = consentStatus === 'granted' ? 'denied' : 'granted';
    localStorage.setItem('ga4-consent', newStatus);
    setConsentStatus(newStatus);
    
    if (newStatus === 'granted') {
      analytics.enableAnalytics();
    } else {
      analytics.disableAnalytics();
    }
    
    // Reload page to apply changes
    window.location.reload();
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all stored analytics data? This will reset your consent preferences.')) {
      localStorage.removeItem('ga4-consent');
      setConsentStatus(null);
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        🔒 Privacy Settings
      </h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Analytics Tracking
          </h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                Google Analytics
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Status: {consentStatus === 'granted' ? 'Enabled' : consentStatus === 'denied' ? 'Disabled' : 'Not Set'}
              </p>
            </div>
            <button
              onClick={toggleConsent}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                consentStatus === 'granted'
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {consentStatus === 'granted' ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Data Management
          </h3>
          <div className="space-y-3">
            <button
              onClick={clearAllData}
              className="w-full px-4 py-2 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              <div className="font-medium text-gray-900 dark:text-gray-100">
                Clear All Data
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Remove all stored preferences and analytics data
              </div>
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 border-t pt-4">
          <p>
            This dashboard respects your privacy. We only collect anonymized analytics data to improve the user experience. 
            No personal information is stored or transmitted to third parties beyond Google Analytics.
          </p>
        </div>
      </div>
    </div>
  );
};
