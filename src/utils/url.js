/**
 * Build a URL with query parameters
 * @param {string} baseUrl - Base URL
 * @param {string} path - Path
 * @param {Object} [params] - Query parameters
 * @returns {string}
 */
export function buildUrl(baseUrl, path, params = {}) {
  const url = new URL(path, baseUrl);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });
  
  return url.href;
}

/**
 * Safely encode a string for use in URLs
 * @param {string} str
 * @returns {string}
 */
export function safeEncodeURIComponent(str) {
  if (!str || typeof str !== 'string') return '';
  
  try {
    return encodeURIComponent(str);
  } catch (e) {
    console.error('Failed to encode URI component:', str, e);
    return '';
  }
}
