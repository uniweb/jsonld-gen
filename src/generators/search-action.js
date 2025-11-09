import { createGenerator } from '../core/generator-base.js';
import { SCHEMA_TYPES, BLOCK_IDS } from '../core/config.js';
import { sanitizeString, buildUrl } from '../utils/index.js';

/**
 * Create a WebSite with SearchAction
 * @param {Object} data - Search data
 * @param {Object} config - Configuration
 * @param {Object} [hooks] - Lifecycle hooks
 * @returns {Object|null} JSON-LD block
 */
export const createSearchActionSchema = createGenerator({
  type: SCHEMA_TYPES.WEBSITE,
  id: BLOCK_IDS.WEBSITE,
  priority: 1,
  generate: (data, config, hooks) => {
    const { baseUrl, organizationName } = config;
    
    const path = data.path || '/experts';
    const siteUrl = buildUrl(baseUrl, path);
    
    return {
      "@context": "https://schema.org",
      "@type": SCHEMA_TYPES.WEBSITE,
      "@id": siteUrl,
      "name": sanitizeString(data.name || `${organizationName} ${data.type || 'Directory'}`),
      "description": sanitizeString(
        data.description || `Search ${organizationName} ${data.type || 'experts'}`
      ),
      "url": siteUrl,
      "potentialAction": {
        "@type": SCHEMA_TYPES.SEARCH_ACTION,
        "target": {
          "@type": SCHEMA_TYPES.ENTRY_POINT,
          "urlTemplate": buildUrl(baseUrl, path, { term: '{search_term}' }),
        },
        "query-input": "required name=search_term",
      },
      "publisher": {
        "@type": SCHEMA_TYPES.ORGANIZATION,
        "@id": baseUrl,
        "name": sanitizeString(organizationName),
      },
    };
  },
});
