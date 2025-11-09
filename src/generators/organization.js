import { createGenerator } from '../core/generator-base.js';
import { SCHEMA_TYPES, BLOCK_IDS } from '../core/config.js';
import { sanitizeString, sanitizeUrl } from '../utils/index.js';

/**
 * Create an Organization schema
 * @param {Object} org - Organization data
 * @param {Object} config - Configuration
 * @param {Object} [hooks] - Lifecycle hooks
 * @returns {Object|null} JSON-LD block
 */
export const createOrganizationSchema = createGenerator({
  type: SCHEMA_TYPES.EDUCATIONAL_ORGANIZATION,
  id: BLOCK_IDS.ORGANIZATION,
  priority: 3,
  generate: (org, config, hooks) => {
    const { baseUrl, organizationName, organizationLogo } = config;
    
    const schema = {
      "@context": "https://schema.org",
      "@type": org?.type || SCHEMA_TYPES.EDUCATIONAL_ORGANIZATION,
      "@id": baseUrl,
      "name": sanitizeString(org?.name || organizationName),
      "url": baseUrl,
    };
    
    const logoUrl = sanitizeUrl(org?.logo || organizationLogo);
    if (logoUrl) {
      schema.logo = logoUrl;
    }
    
    if (org?.description) {
      schema.description = sanitizeString(org.description);
    }
    
    return schema;
  },
});
