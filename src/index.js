// Core
export { createGenerator, createBlock } from './core/generator-base.js';
export { composeSchemas, deduplicateSchemas, toHTML } from './core/composer.js';
export { validateSchema, validateConfig } from './core/validator.js';
export { SCHEMA_TYPES, BLOCK_IDS, DEFAULT_CONFIG } from './core/config.js';

// Generators
export {
  createPersonSchema,
  createVideoSchema,
  createOrganizationSchema,
  createBreadcrumbSchema,
  createSearchActionSchema,
  createArticleSchema,
} from './generators/index.js';

// Meta tags
export {
  generateMetaTags,
  generatePersonMetaTags,
  generateVideoMetaTags,
  generateSearchMetaTags,
} from './meta/index.js';

// Utils
export {
  sanitizeString,
  sanitizeUrl,
  sanitizeEmail,
  sanitizeArray,
  truncateText,
  parseNameParts,
  extractHonorific,
  buildUrl,
  formatDuration,
  parseDuration,
  escapeHtml,
  metaTagsToHTML,
} from './utils/index.js';
