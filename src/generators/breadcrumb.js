import { createGenerator } from '../core/generator-base.js';
import { SCHEMA_TYPES, BLOCK_IDS } from '../core/config.js';
import { sanitizeString, buildUrl } from '../utils/index.js';

/**
 * Create a BreadcrumbList schema
 * @param {Array<string|Object>} items - Breadcrumb items
 * @param {Object} config - Configuration
 * @param {Object} [hooks] - Lifecycle hooks
 * @returns {Object|null} JSON-LD block
 */
export const createBreadcrumbSchema = createGenerator({
  type: SCHEMA_TYPES.BREADCRUMB_LIST,
  id: BLOCK_IDS.BREADCRUMB,
  priority: 2,
  generate: (items, config, hooks) => {
    const { baseUrl, searchTerm } = config;
    
    if (!Array.isArray(items) || items.length === 0) {
      return null;
    }
    
    const itemListElement = items.map((item, index) => {
      const name = typeof item === 'string' ? item : item.name;
      let itemUrl = typeof item === 'object' ? item.url : null;
      
      // Auto-generate URLs for common patterns if not provided
      if (!itemUrl) {
        if (index === 0) {
          itemUrl = baseUrl;
        } else if (index === 1 && name.toLowerCase().includes('expert')) {
          itemUrl = buildUrl(baseUrl, '/experts');
        } else if (index === 1 && name.toLowerCase().includes('video')) {
          itemUrl = buildUrl(baseUrl, '/videos');
        } else if (name.startsWith('Search:') && searchTerm) {
          const path = items[1]?.name?.toLowerCase().includes('video') ? '/videos' : '/experts';
          itemUrl = buildUrl(baseUrl, path, { term: searchTerm });
        }
      }
      
      const listItem = {
        "@type": SCHEMA_TYPES.LIST_ITEM,
        "position": index + 1,
        "name": sanitizeString(name),
      };
      
      if (itemUrl) {
        listItem.item = itemUrl;
      }
      
      return listItem;
    });
    
    return {
      "@context": "https://schema.org",
      "@type": SCHEMA_TYPES.BREADCRUMB_LIST,
      "itemListElement": itemListElement,
    };
  },
});
