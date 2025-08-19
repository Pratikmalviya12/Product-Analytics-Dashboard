import React from "react";
import {
  Button,
  Card,
  StatusBadge,
  Input,
  LoadingSpinner,
  Select,
} from "./components";
import { ThemeToggle } from "./ThemeToggle";
import { AgGridEvents } from "../features/table/AgGridEvents";
import { trackDashboardEvents } from "../services/analytics";
import { useDashboardStore } from "./dashboard/store";
import {
  generateEvents,
  calculateKpis,
  formatCompact,
} from "./dashboard/utils";
import { fetchGA4Data, fetchGA4RealtimeData } from "./dashboard/ga4";
import { EventChart } from "./dashboard/components/EventChart";
import { DeviceChart } from "./dashboard/components/DeviceChart";
import { CountryChart } from "./dashboard/components/CountryChart";
import { GA4Setup } from "./dashboard/components/GA4Setup";
import { RealtimeGA4 } from "./dashboard/components/RealtimeGA4";
import { SavedViews } from "./dashboard/components/SavedViews";
import { AdvancedFilters } from "./dashboard/components/AdvancedFilters";
import { KpiCard } from "./dashboard/components/KpiCard";

/**
 * Main Dashboard Component
 *
 * @description The primary analytics dashboard that provides comprehensive data visualization
 * and analytics capabilities. Supports both simulated data and real Google Analytics 4 (GA4) integration.
 *
 * @features
 * - Real-time data visualization with interactive charts
 * - GA4 integration with authentication and real-time data fetching
 * - Configurable filters (country, date range, purchase events)
 * - KPI cards showing key metrics (users, sessions, conversion rate, revenue)
 * - Multiple chart types (events, device, country distributions)
 * - Saved views for quick access to common configurations
 * - Theme toggle support (light/dark mode)
 * - Responsive design optimized for all screen sizes
 *
 * @state
 * - ga4Events: Array of events fetched from GA4 API
 * - isLoadingGA4: Loading state for GA4 data fetching
 * - realtimeEvents: Real-time events from GA4 Realtime API
 * - isRealtimeActive: Toggle for real-time data streaming
 *
 * @hooks
 * - useDashboardStore: Global state management for filters, data source, and configuration
 * - useEffect: Handles GA4 data fetching, real-time updates, and analytics tracking
 *
 * @dependencies
 * - Dashboard store for state management
 * - GA4 API integration for real data
 * - Analytics service for user behavior tracking
 * - Multiple chart components for data visualization
 *
 * @example
 * ```tsx
 * <Dashboard />
 * ```
 */
export function Dashboard() {
  const { seed, setSeed, filters, setFilters, dataSource, ga4Config } =
    useDashboardStore();
  const [ga4Events, setGA4Events] = React.useState<any[]>([]);
  const [isLoadingGA4, setIsLoadingGA4] = React.useState(false);
  const [realtimeEvents, setRealtimeEvents] = React.useState<any[]>([]);
  const [isRealtimeActive, setIsRealtimeActive] = React.useState(false);

  React.useEffect(() => {
    trackDashboardEvents.dataSourceChanged(dataSource);
  }, []);

  React.useEffect(() => {
    if (dataSource === "ga4" && ga4Config.isAuthenticated) {
      setIsLoadingGA4(true);

      const dateRange =
        filters.dateRange?.start && filters.dateRange?.end
          ? { start: filters.dateRange.start, end: filters.dateRange.end }
          : { start: "30daysAgo", end: "today" };

      fetchGA4Data(
        ga4Config.propertyId,
        ga4Config.serviceAccountJson,
        dateRange
      )
        .then((data) => {
          setGA4Events(data);
          setIsLoadingGA4(false);
        })
        .catch((error) => {
          console.error("GA4 fetch error:", error);
          setIsLoadingGA4(false);
        });
    }
  }, [
    dataSource,
    ga4Config.isAuthenticated,
    ga4Config.propertyId,
    ga4Config.serviceAccountJson,
    filters.dateRange,
  ]);

  React.useEffect(() => {
    if (
      dataSource !== "ga4" ||
      !ga4Config.isAuthenticated ||
      !isRealtimeActive
    ) {
      return;
    }

    const fetchRealtimeData = async () => {
      try {
        const newEvents = await fetchGA4RealtimeData(
          ga4Config.propertyId,
          ga4Config.serviceAccountJson
        );

        setRealtimeEvents((prevEvents) => {
          const combinedEvents = [...newEvents, ...prevEvents];
          const oneHourAgo = Date.now() - 60 * 60 * 1000;
          return combinedEvents
            .filter((event) => event.timestamp > oneHourAgo)
            .slice(0, 500)
            .sort((a, b) => b.timestamp - a.timestamp);
        });

        if (Math.random() < 0.1) {
          const data = await fetchGA4Data(
            ga4Config.propertyId,
            ga4Config.serviceAccountJson
          );
          setGA4Events(data);
        }
      } catch (error) {
        console.error("Real-time fetch error:", error);
      }
    };

    fetchRealtimeData();

    const interval = setInterval(fetchRealtimeData, 10000);

    return () => clearInterval(interval);
  }, [
    dataSource,
    ga4Config.isAuthenticated,
    isRealtimeActive,
    ga4Config.propertyId,
    ga4Config.serviceAccountJson,
  ]);

  const allEvents = React.useMemo(() => {
    if (dataSource === "ga4") {
      if (isRealtimeActive && realtimeEvents.length > 0) {
        const combinedEvents = [...realtimeEvents, ...ga4Events];
        const uniqueEvents = combinedEvents.filter(
          (event, index, self) =>
            index === self.findIndex((e) => e.id === event.id)
        );
        return uniqueEvents.sort((a, b) => b.timestamp - a.timestamp);
      }
      return ga4Events;
    }
    return generateEvents(seed, 50000);
  }, [dataSource, ga4Events, seed, isRealtimeActive, realtimeEvents]);

  const events = React.useMemo(() => {
    let filtered = allEvents;

    if (filters.showPurchasesOnly) {
      filtered = filtered.filter((e) => e.event === "purchase");
    }

    if (filters.selectedCountry && filters.selectedCountry !== "all") {
      filtered = filtered.filter((e) => e.country === filters.selectedCountry);
    }

    if (filters.selectedDevice && filters.selectedDevice !== "all") {
      filtered = filtered.filter((e) => e.device === filters.selectedDevice);
    }

    if (filters.eventType && filters.eventType !== "all") {
      filtered = filtered.filter((e) => e.event === filters.eventType);
    }

    if (filters.dateRange?.start || filters.dateRange?.end) {
      const startTime = filters.dateRange?.start
        ? new Date(filters.dateRange.start).getTime()
        : 0;
      const endTime = filters.dateRange?.end
        ? new Date(filters.dateRange.end).getTime() + 24 * 60 * 60 * 1000
        : Date.now();

      filtered = filtered.filter(
        (e) => e.timestamp >= startTime && e.timestamp <= endTime
      );
    }

    return filtered;
  }, [allEvents, filters]);

  const kpis = React.useMemo(() => calculateKpis(events), [events]);
  const uniqueCountries = React.useMemo(
    () => [...new Set(allEvents.map((e) => e.country))].sort(),
    [allEvents]
  );

  return (
    <main className="min-h-screen font-sans bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 scroll-container transition-colors duration-300">
      <div className="min-h-screen p-3 sm:p-4 lg:p-6">
        {/* Background Pattern */}
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-30 dark:opacity-20 transition-opacity duration-300"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.08) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px, 60px 60px",
          }}
        ></div>

        <div className="relative z-10">
          <header className="bg-white/95 backdrop-saturate-150 border border-gray-200/60 dark:bg-gray-800/95 dark:border-gray-700/60 mb-6 lg:mb-8 p-4 sm:p-6 lg:p-8 shadow-xl relative overflow-hidden animate-fade-in rounded-xl lg:rounded-2xl">
            {/* Decorative Background Elements */}
            <div className="absolute -top-8 -right-8 sm:-top-12 sm:-right-12 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-indigo-100/40 via-purple-100/30 to-pink-100/40 dark:from-indigo-900/40 dark:via-purple-900/30 dark:to-pink-900/40 rounded-full"></div>
            <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-100/30 via-indigo-100/40 to-cyan-100/30 dark:from-blue-900/30 dark:via-indigo-900/40 dark:to-cyan-900/30 rounded-full"></div>

            {/* Theme Toggle */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
              <ThemeToggle />
            </div>

            <div className="relative z-10 pr-12 sm:pr-16">
              {/* Title Section */}
              <div className="mb-4 lg:mb-6">
                <h1 className="text-gray-900 dark:text-white text-xl sm:text-2xl lg:text-3xl mb-2 lg:mb-3 font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                  <span className="text-white">📊</span> Product Analytics
                  Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-base font-medium">
                  Real-time insights and data visualization
                </p>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 lg:gap-3 items-center mb-4 lg:mb-6">
                <StatusBadge
                  status="info"
                  className="text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                >
                  {allEvents.length.toLocaleString()} total events
                </StatusBadge>
                <StatusBadge
                  status="neutral"
                  className="text-xs font-medium bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"
                >
                  {events.length.toLocaleString()} filtered
                </StatusBadge>
                {dataSource === "simulated" && (
                  <StatusBadge
                    status="info"
                    className="text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700"
                  >
                    🎲 Seed: {seed}
                  </StatusBadge>
                )}
                {dataSource === "ga4" && ga4Config.isAuthenticated && (
                  <StatusBadge
                    status={isRealtimeActive ? "error" : "success"}
                    className={`text-xs font-medium flex items-center gap-1.5 ${
                      isRealtimeActive
                        ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700"
                        : "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isRealtimeActive
                          ? "bg-red-500 animate-pulse"
                          : "bg-green-500"
                      }`}
                    ></span>
                    {isRealtimeActive ? "Live Dashboard Mode" : "GA4 Connected"}
                  </StatusBadge>
                )}
              </div>

              {/* Controls Section */}
              <div className="flex items-center gap-4 flex-wrap">
                {/* Country Filter */}
                <div className="flex items-center gap-2">
                  <label className="text-gray-700 dark:text-gray-300 text-sm font-medium whitespace-nowrap">
                    Country:
                  </label>
                  <Select
                    value={filters.selectedCountry || "all"}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setFilters({
                        selectedCountry:
                          e.target.value === "all" ? null : e.target.value,
                      })
                    }
                    className="flex-1 sm:flex-none bg-white/90 border-gray-300/60 text-gray-700 dark:bg-gray-800/90 dark:text-white dark:border-gray-600/60 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 transition-all duration-200 !w-fit"
                  >
                    <option
                      value="all"
                      className="text-gray-800 dark:text-gray-200"
                    >
                      All Countries
                    </option>
                    {uniqueCountries.map((country) => (
                      <option
                        key={country}
                        value={country}
                        className="text-gray-800 dark:text-gray-200"
                      >
                        {country}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Purchase Filter Checkbox */}
                <label className="flex items-center gap-2 text-sm w-fit bg-white/80 dark:bg-gray-800/80 px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg cursor-pointer border border-gray-200/60 dark:border-gray-600/60 hover:bg-white/90 dark:hover:bg-gray-800/90 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300 justify-center sm:justify-start backdrop-saturate-150">
                  <Input
                    type="checkbox"
                    checked={filters.showPurchasesOnly}
                    onChange={(e: any) =>
                      setFilters({ showPurchasesOnly: e.target.checked })
                    }
                    className="accent-green-500 dark:accent-green-400 scale-110 transition-transform duration-200"
                  />
                  <span className="text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
                    💰 Purchases only
                  </span>
                </label>

                {/* Randomize Button */}
                <Button
                  variant="success"
                  size="medium"
                  onClick={() => setSeed(Math.floor(Math.random() * 1000))}
                  className="flex items-center justify-center gap-2 font-medium w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 dark:from-green-600 dark:to-emerald-600 dark:hover:from-green-700 dark:hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  🎲 Randomize Data
                </Button>
              </div>
            </div>
          </header>

          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8 animate-slide-up">
            <KpiCard
              label="Total Users"
              value={formatCompact(kpis.users)}
              change="+12.3%"
              positive={true}
            />
            <KpiCard
              label="Sessions"
              value={formatCompact(kpis.sessions)}
              change="+8.7%"
              positive={true}
            />
            <KpiCard
              label="Conversion Rate"
              value={`${(kpis.conversion * 100).toFixed(1)}%`}
              change="-2.1%"
              positive={false}
            />
            <KpiCard
              label="Revenue"
              value={`$${formatCompact(kpis.revenue)}`}
              change="+15.4%"
              positive={true}
            />
          </section>

          <section className="mb-4 lg:mb-6">
            {dataSource === "ga4" && ga4Config.isAuthenticated ? (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-5 mb-4 lg:mb-5">
                <div className="xl:col-span-2 grid grid-rows-1 lg:grid-rows-2 gap-4">
                  <EventChart events={events} />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <DeviceChart events={events} />
                    <CountryChart events={events} />
                  </div>
                </div>
                <div className="xl:col-span-1">
                  <RealtimeGA4
                    realtimeEvents={realtimeEvents}
                    isRealtimeActive={isRealtimeActive}
                    setIsRealtimeActive={setIsRealtimeActive}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <EventChart events={events} />
                </div>
                <div className="lg:col-span-1">
                  <DeviceChart events={events} />
                </div>
              </div>
            )}
          </section>

          <section className="mb-4 lg:mb-6">
            <SavedViews />
          </section>

          <section className="mb-4 lg:mb-6">
            <GA4Setup />
          </section>

          {isLoadingGA4 && (
            <section className="mb-4 lg:mb-6">
              <Card className="text-center py-8 lg:py-12">
                <LoadingSpinner size="large" className="mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300 text-base lg:text-lg font-medium">
                  Loading GA4 data...
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  This may take a few moments
                </p>
              </Card>
            </section>
          )}

          <section className="mb-4 lg:mb-6">
            <AdvancedFilters events={allEvents} />
          </section>

          <section className="mb-4 lg:mb-6">
            <DataTools events={allEvents} filteredEvents={events} />
          </section>

          {/* Full-width table section that breaks out of main container padding */}
          <div className="px-3 sm:px-4 lg:px-6 mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4 text-gray-900 dark:text-gray-100">
              📋 Event Data ({events.length.toLocaleString()} events)
            </h2>
          </div>
          <div className="mx-3 sm:mx-4 lg:mx-6 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 overflow-hidden shadow-lg">
            <div className="w-full overflow-x-auto">
              <AgGridEvents events={events} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const DataTools = ({
  events,
  filteredEvents,
}: {
  events: any[];
  filteredEvents: any[];
}) => {
  const { exportData } = useDashboardStore() as any;
  const [showTools, setShowTools] = React.useState(false);

  const generateReport = () => {
    const kpis = calculateKpis(filteredEvents);
    const report = {
      generatedAt: new Date().toISOString(),
      totalEvents: events.length,
      filteredEvents: filteredEvents.length,
      kpis,
      topCountries: getTopItems(filteredEvents, "country"),
      topDevices: getTopItems(filteredEvents, "device"),
      eventBreakdown: getTopItems(filteredEvents, "event"),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-report-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getTopItems = (events: any[], field: string) => {
    const counts = events.reduce((acc: Record<string, number>, event: any) => {
      acc[event[field]] = (acc[event[field]] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        count,
        percentage: (((count as number) / events.length) * 100).toFixed(1),
      }));
  };

  return (
    <Card className="glass-card border border-gray-200/60 dark:border-gray-700/60">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h3 className="text-gray-800 dark:text-gray-100 text-lg font-semibold m-0 flex items-center gap-2">
            🛠️ Data Tools
          </h3>
          <StatusBadge
            status="neutral"
            className="text-xs bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 w-fit"
          >
            {filteredEvents.length.toLocaleString()} events
          </StatusBadge>
        </div>
        <Button
          onClick={() => setShowTools(!showTools)}
          variant="secondary"
          size="small"
          className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 w-fit"
        >
          {showTools ? "▲" : "▼"} {showTools ? "Hide" : "Show"} Tools
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => exportData(filteredEvents)}
          variant="primary"
          size="medium"
          className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 dark:from-blue-600 dark:to-indigo-600 dark:hover:from-blue-700 dark:hover:to-indigo-700"
        >
          📊 Export CSV
          <span className="text-xs opacity-80">
            ({filteredEvents.length.toLocaleString()})
          </span>
        </Button>

        <Button
          onClick={generateReport}
          variant="success"
          size="medium"
          className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 dark:from-green-600 dark:to-emerald-600 dark:hover:from-green-700 dark:hover:to-emerald-700"
        >
          📈 Generate Report
        </Button>
      </div>

      {showTools && (
        <div className="mt-6 p-4 bg-gray-50/80 dark:bg-gray-800/80 rounded-lg border border-gray-200/60 dark:border-gray-600/60 backdrop-saturate-150">
          <h4 className="text-gray-800 dark:text-gray-100 text-sm font-semibold mb-4 flex items-center gap-2">
            💡 Quick Insights
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-white/90 dark:bg-gray-700/90 p-3 rounded-lg border border-gray-200/60 dark:border-gray-600/60">
              <div className="text-gray-600 dark:text-gray-300 text-xs font-medium mb-1">
                DATA COVERAGE
              </div>
              <div className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
                {((filteredEvents.length / events.length) * 100).toFixed(1)}%
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">
                of total data
              </div>
            </div>
            <div className="bg-white/70 dark:bg-gray-700/70 p-3 rounded-lg border border-gray-200/60 dark:border-gray-600/60">
              <div className="text-gray-600 dark:text-gray-300 text-xs font-medium mb-1">
                TOP COUNTRY
              </div>
              <div className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
                {getTopItems(filteredEvents, "country")[0]?.name || "N/A"}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">
                {getTopItems(filteredEvents, "country")[0]?.percentage || "0"}%
                of events
              </div>
            </div>
            <div className="bg-white/70 dark:bg-gray-700/70 p-3 rounded-lg border border-gray-200/60 dark:border-gray-600/60">
              <div className="text-gray-600 dark:text-gray-300 text-xs font-medium mb-1">
                TOP DEVICE
              </div>
              <div className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
                {getTopItems(filteredEvents, "device")[0]?.name || "N/A"}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">
                {getTopItems(filteredEvents, "device")[0]?.percentage || "0"}%
                of events
              </div>
            </div>
            <div className="bg-white/70 dark:bg-gray-700/70 p-3 rounded-lg border border-gray-200/60 dark:border-gray-600/60">
              <div className="text-gray-600 dark:text-gray-300 text-xs font-medium mb-1">
                TOP EVENT
              </div>
              <div className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
                {getTopItems(filteredEvents, "event")[0]?.name?.replace(
                  "_",
                  " "
                ) || "N/A"}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">
                {getTopItems(filteredEvents, "event")[0]?.percentage || "0"}% of
                events
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default Dashboard;
