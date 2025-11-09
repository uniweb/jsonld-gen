/**
 * Sanitize a string for use in JSON-LD
 * Removes control characters and trims whitespace
 * @param {string} str
 * @returns {string}
 */
export function sanitizeString(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Validate and sanitize a URL
 * @param {string} url
 * @returns {string|null}
 */
export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return null;
  
  try {
    const urlObj = new URL(url);
    return urlObj.href;
  } catch {
    return null;
  }
}

/**
 * Validate an email address (basic check)
 * @param {string} email
 * @returns {string|null}
 */
export function sanitizeEmail(email) {
  if (!email || typeof email !== 'string') return null;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? email.trim().toLowerCase() : null;
}

/**
 * Validate and limit an array
 * @param {Array} arr
 * @param {number} maxLength
 * @param {Function} [validator]
 * @returns {Array}
 */
export function sanitizeArray(arr, maxLength, validator = null) {
  if (!Array.isArray(arr)) return [];
  
  let filtered = arr.filter(item => {
    if (item === null || item === undefined) return false;
    if (validator) return validator(item);
    return true;
  });
  
  return filtered.slice(0, maxLength);
}
