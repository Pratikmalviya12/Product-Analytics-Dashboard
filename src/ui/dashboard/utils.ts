import { generateEvents as generateEventsFromLib } from '../../lib/data'
import { Event } from '../../lib/types'

// Use the centralized event generation function
export function generateEvents(seed: number, count = 100_000): Event[] {
  return generateEventsFromLib(seed, 30, count)
}

export const calculateKpis = (events: Event[]) => {
  const users = new Set(events.map((e) => e.userId)).size;
  const sessions = new Set(events.map((e) => e.sessionId)).size;
  const purchases = events.filter((e) => e.event === "purchase").length;
  const revenue = events.reduce((sum, e) => sum + (e.revenue || 0), 0);

  return {
    users,
    sessions,
    purchases,
    conversion: users > 0 ? purchases / users : 0,
    revenue,
  };
};

export function formatCompact(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}
