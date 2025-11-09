/**
 * Validate a JSON-LD schema (basic validation)
 * @param {Object} schema - JSON-LD schema
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateSchema(schema) {
  const errors = [];

  if (!schema || typeof schema !== 'object') {
    errors.push('Schema must be an object');
    return { valid: false, errors };
  }

  if (!schema['@context']) {
    errors.push('Missing @context');
  }

  if (!schema['@type']) {
    errors.push('Missing @type');
  }

  // Type-specific validation
  switch (schema['@type']) {
    case 'Person':
      if (!schema.name) errors.push('Person missing name');
      break;
    
    case 'VideoObject':
      if (!schema.name) errors.push('VideoObject missing name');
      if (!schema.uploadDate) errors.push('VideoObject missing uploadDate');
      if (!schema.thumbnailUrl) errors.push('VideoObject missing thumbnailUrl');
      break;
    
    case 'BreadcrumbList':
      if (!schema.itemListElement || !Array.isArray(schema.itemListElement)) {
        errors.push('BreadcrumbList missing itemListElement array');
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate configuration object
 * @param {Object} config
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateConfig(config) {
  const errors = [];

  if (!config || typeof config !== 'object') {
    errors.push('Config must be an object');
    return { valid: false, errors };
  }

  if (!config.baseUrl) {
    errors.push('Config missing baseUrl');
  } else {
    try {
      new URL(config.baseUrl);
    } catch {
      errors.push('Config baseUrl is not a valid URL');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
