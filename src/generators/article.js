import { createGenerator } from '../core/generator-base.js';
import { SCHEMA_TYPES, BLOCK_IDS } from '../core/config.js';
import { sanitizeString, sanitizeUrl, buildUrl } from '../utils/index.js';

/**
 * Create an Article schema
 * @param {Object} article - Article data
 * @param {Object} config - Configuration
 * @param {Object} [hooks] - Lifecycle hooks
 * @returns {Object|null} JSON-LD block
 */
export const createArticleSchema = createGenerator({
  type: SCHEMA_TYPES.ARTICLE,
  id: BLOCK_IDS.ARTICLE,
  priority: 1,
  generate: (article, config, hooks) => {
    const { baseUrl, organizationName, organizationLogo } = config;
    
    if (!article.id || !article.title) {
      console.warn('[Article] Missing required fields: id, title');
      return null;
    }
    
    const articleUrl = buildUrl(baseUrl, '/articles', { id: article.id });
    
    const schema = {
      "@context": "https://schema.org",
      "@type": SCHEMA_TYPES.ARTICLE,
      "@id": articleUrl,
      "headline": sanitizeString(article.title),
      "url": articleUrl,
    };
    
    if (article.description) {
      schema.description = sanitizeString(article.description);
    }
    
    if (article.publishDate) {
      schema.datePublished = article.publishDate;
    }
    
    if (article.modifiedDate) {
      schema.dateModified = article.modifiedDate;
    }
    
    // Author
    if (article.author) {
      schema.author = {
        "@type": SCHEMA_TYPES.PERSON,
        "name": sanitizeString(article.author.name),
      };
      
      const authorUrl = sanitizeUrl(article.author.url);
      if (authorUrl) {
        schema.author.url = authorUrl;
      }
    }
    
    // Publisher
    if (organizationName) {
      schema.publisher = {
        "@type": SCHEMA_TYPES.ORGANIZATION,
        "name": sanitizeString(organizationName),
      };
      
      if (organizationLogo) {
        schema.publisher.logo = {
          "@type": SCHEMA_TYPES.IMAGE_OBJECT,
          "url": sanitizeUrl(organizationLogo),
        };
      }
    }
    
    // Image
    const imageUrl = sanitizeUrl(article.imageUrl);
    if (imageUrl) {
      schema.image = imageUrl;
    }
    
    return schema;
  },
});
