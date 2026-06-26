/**
 * Formats an ISO date string into a relative label.
 * e.g. "2 hours ago", "Yesterday, 11:15 PM", "3 days ago"
 */
export function formatRelativeTime(isoDate) {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffSecs = Math.floor((now - then) / 1000);

  if (diffSecs < 60) return 'Just now';
  if (diffSecs < 3600) {
    const m = Math.floor(diffSecs / 60);
    return `${m} minute${m !== 1 ? 's' : ''} ago`;
  }
  if (diffSecs < 86400) {
    const h = Math.floor(diffSecs / 3600);
    return `${h} hour${h !== 1 ? 's' : ''} ago`;
  }
  if (diffSecs < 172800) {
    // Yesterday
    const d = new Date(then);
    return `Yesterday, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  }
  const days = Math.floor(diffSecs / 86400);
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? 's' : ''} ago`;
}

/**
 * Formats a view count to a compact label.
 * e.g. 1200000 → "1.2M views"
 */
export function formatViewCount(count) {
  if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B views`;
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M views`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K views`;
  return `${count} views`;
}
