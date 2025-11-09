/**
 * Truncate text to a maximum length with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncateText(text, maxLength) {
  if (!text || typeof text !== 'string') return '';
  
  const sanitized = text.trim();
  if (sanitized.length <= maxLength) return sanitized;
  
  return sanitized.substring(0, maxLength - 3) + '...';
}

/**
 * Extract first name and last name from full name
 * @param {string} fullName
 * @param {string} [firstName]
 * @param {string} [lastName]
 * @returns {{ firstName: string, lastName: string }}
 */
export function parseNameParts(fullName, firstName, lastName) {
  if (firstName && lastName) {
    return { firstName, lastName };
  }
  
  if (!fullName) {
    return { firstName: '', lastName: '' };
  }
  
  const parts = fullName.trim().split(/\s+/);
  
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }
  
  return {
    firstName: firstName || parts[0],
    lastName: lastName || parts.slice(1).join(' '),
  };
}

/**
 * Extract honorific prefix from name (Dr., Prof., etc.)
 * @param {string} fullName
 * @returns {string|null}
 */
export function extractHonorific(fullName) {
  if (!fullName) return null;
  
  const honorifics = ['Dr.', 'Prof.', 'Professor', 'Mr.', 'Ms.', 'Mrs.', 'Mx.'];
  const parts = fullName.trim().split(/\s+/);
  
  if (parts.length > 1) {
    const firstPart = parts[0];
    const matched = honorifics.find(h => 
      firstPart.toLowerCase().replace('.', '') === h.toLowerCase().replace('.', '')
    );
    return matched || null;
  }
  
  return null;
}
