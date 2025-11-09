/**
 * Convert seconds to ISO 8601 duration format
 * @param {number} seconds
 * @returns {string} ISO 8601 duration (e.g., "PT5M30S")
 */
export function formatDuration(seconds) {
  if (!seconds || seconds < 0) return 'PT0S';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  let duration = 'PT';
  if (hours > 0) duration += `${hours}H`;
  if (minutes > 0) duration += `${minutes}M`;
  if (secs > 0 || duration === 'PT') duration += `${secs}S`;
  
  return duration;
}

/**
 * Parse ISO 8601 duration to seconds
 * @param {string} duration
 * @returns {number}
 */
export function parseDuration(duration) {
  if (!duration || typeof duration !== 'string') return 0;
  
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = duration.match(regex);
  
  if (!matches) return 0;
  
  const hours = parseInt(matches[1] || 0, 10);
  const minutes = parseInt(matches[2] || 0, 10);
  const seconds = parseInt(matches[3] || 0, 10);
  
  return hours * 3600 + minutes * 60 + seconds;
}
