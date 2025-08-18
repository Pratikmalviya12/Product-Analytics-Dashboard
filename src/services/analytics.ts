// Google Analytics 4 tracking utilities
// This file provides methods to track custom events and user interactions

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface AnalyticsEvent {
  event_name: string;
  event_category?: string;
  event_label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface UserProperties {
  user_id?: string;
  custom_user_id?: string;
  [key: string]: any;
}

class AnalyticsService {
  private isInitialized = false;
  private measurementId: string | null = null;

  constructor() {
    this.checkInitialization();
  }

  private checkInitialization() {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      this.isInitialized = true;
      // Extract measurement ID from the page if available
      const scripts = document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]');
      if (scripts.length > 0) {
        const src = scripts[0].getAttribute('src');
        const match = src?.match(/id=([^&]+)/);
        this.measurementId = match ? match[1] : null;
      }
    }
  }

  /**
   * Track a custom event
   */
  trackEvent(eventName: string, parameters: Record<string, any> = {}) {
    if (!this.isInitialized) {
      console.warn('Google Analytics not initialized. Event not tracked:', eventName);
      return;
    }

    window.gtag('event', eventName, {
      ...parameters,
      // Add timestamp for better tracking
      timestamp: Date.now()
    });

    console.log('📊 GA4 Event Tracked:', eventName, parameters);
  }

  /**
   * Track page views (usually automatic, but useful for SPAs)
   */
  trackPageView(pagePath: string, pageTitle?: string) {
    if (!this.isInitialized) return;

    window.gtag('config', this.measurementId!, {
      page_path: pagePath,
      page_title: pageTitle || document.title
    });
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: UserProperties) {
    if (!this.isInitialized) return;

    window.gtag('set', properties);
  }

  /**
   * Track user identification
   */
  identifyUser(userId: string) {
    if (!this.isInitialized) return;

    window.gtag('config', this.measurementId!, {
      user_id: userId
    });
  }

  /**
   * Track conversion events
   */
  trackConversion(eventName: string, value?: number, currency: string = 'USD') {
    this.trackEvent(eventName, {
      value: value,
      currency: currency
    });
  }

  /**
   * Track dashboard-specific events
   */
  trackDashboardEvent(action: string, details: Record<string, any> = {}) {
    this.trackEvent('dashboard_interaction', {
      dashboard_action: action,
      ...details
    });
  }

  /**
   * Track filter usage
   */
  trackFilterUsage(filterType: string, filterValue: string) {
    this.trackEvent('filter_applied', {
      filter_type: filterType,
      filter_value: filterValue
    });
  }

  /**
   * Track data export
   */
  trackDataExport(exportType: string, recordCount: number) {
    this.trackEvent('data_export', {
      export_type: exportType,
      record_count: recordCount
    });
  }

  /**
   * Track chart interactions
   */
  trackChartInteraction(chartType: string, interaction: string) {
    this.trackEvent('chart_interaction', {
      chart_type: chartType,
      interaction_type: interaction
    });
  }

  /**
   * Enable debug mode (for development)
   */
  enableDebugMode() {
    if (!this.isInitialized) return;
    
    window.gtag('config', this.measurementId!, {
      debug_mode: true
    });
  }

  /**
   * Disable analytics (for privacy compliance)
   */
  disableAnalytics() {
    if (!this.isInitialized) return;

    window.gtag('consent', 'update', {
      analytics_storage: 'denied'
    });
  }

  /**
   * Enable analytics (for privacy compliance)
   */
  enableAnalytics() {
    if (!this.isInitialized) return;

    window.gtag('consent', 'update', {
      analytics_storage: 'granted'
    });
  }
}

// Create singleton instance
export const analytics = new AnalyticsService();

// Predefined event tracking functions for common dashboard actions
export const trackDashboardEvents = {
  // Data source changes
  dataSourceChanged: (source: 'simulated' | 'ga4') => {
    analytics.trackDashboardEvent('data_source_changed', { source });
  },

  // Filter interactions
  filterApplied: (filterType: string, value: string) => {
    analytics.trackFilterUsage(filterType, value);
  },

  // Chart interactions
  chartClicked: (chartType: string) => {
    analytics.trackChartInteraction(chartType, 'click');
  },

  chartHovered: (chartType: string) => {
    analytics.trackChartInteraction(chartType, 'hover');
  },

  // Data export
  dataExported: (format: string, count: number) => {
    analytics.trackDataExport(format, count);
  },

  // Saved views
  viewSaved: (viewName: string) => {
    analytics.trackDashboardEvent('view_saved', { view_name: viewName });
  },

  viewLoaded: (viewName: string) => {
    analytics.trackDashboardEvent('view_loaded', { view_name: viewName });
  },

  // Real-time monitoring
  realtimeEnabled: () => {
    analytics.trackDashboardEvent('realtime_enabled');
  },

  realtimeDisabled: () => {
    analytics.trackDashboardEvent('realtime_disabled');
  },

  // GA4 setup events
  ga4Connected: () => {
    analytics.trackDashboardEvent('ga4_connected');
  },

  ga4Disconnected: () => {
    analytics.trackDashboardEvent('ga4_disconnected');
  },

  // Theme changes
  themeChanged: (theme: string) => {
    analytics.trackDashboardEvent('theme_changed', { theme });
  }
};

export default analytics;
