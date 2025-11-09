import {
  createVideoSchema,
  createOrganizationSchema,
  createBreadcrumbSchema,
  createSearchActionSchema,
} from '../generators/index.js';
import { composeSchemas } from '../core/composer.js';
import { generateVideoMetaTags, generateSearchMetaTags } from '../meta/index.js';

/**
 * Generate metadata for a video page
 * @param {Object} video - Video data
 * @param {Object} config - Configuration
 * @returns {{ schemas: Array, metaTags: Object }}
 */
export function generateVideoPage(video, config) {
  const breadcrumbItems = ['Home', 'Videos', video.title];
  
  const schemas = composeSchemas([
    createVideoSchema(video, config),
    createBreadcrumbSchema(breadcrumbItems, config),
    createOrganizationSchema({}, config),
  ]);
  
  const metaTags = generateVideoMetaTags(video, config);
  
  return { schemas, metaTags };
}

/**
 * Generate metadata for video library home
 * @param {Object} config - Configuration
 * @returns {{ schemas: Array, metaTags: Object }}
 */
export function generateVideoLibrary(config) {
  const schemas = composeSchemas([
    createSearchActionSchema({
      name: `${config.organizationName} Video Library`,
      description: `Browse and search ${config.organizationName} videos`,
      path: '/videos',
      type: 'videos'
    }, config),
    createOrganizationSchema({}, config),
  ]);
  
  const metaTags = {
    title: `Video Library - ${config.organizationName}`,
    description: `Browse and watch videos from ${config.organizationName}`,
    canonical: `${config.baseUrl}/videos`,
    ogTitle: `${config.organizationName} Videos`,
    ogDescription: `Explore our video collection`,
    ogType: 'website',
    ogUrl: `${config.baseUrl}/videos`,
    twitterCard: 'summary_large_image',
  };
  
  return { schemas, metaTags };
}

/**
 * Generate metadata for video search results
 * @param {Array} results - Search results
 * @param {string} searchTerm - Search term
 * @param {Object} config - Configuration
 * @returns {{ schemas: Array, metaTags: Object }}
 */
export function generateVideoSearchResults(results, searchTerm, config) {
  const breadcrumbItems = ['Home', 'Videos', `Search: ${searchTerm}`];
  const configWithSearchTerm = { ...config, searchTerm };
  
  const schemas = composeSchemas([
    createBreadcrumbSchema(breadcrumbItems, configWithSearchTerm),
    createOrganizationSchema({}, config),
  ]);
  
  const metaTags = generateSearchMetaTags({
    searchTerm,
    results,
    path: '/videos'
  }, config);
  
  return { schemas, metaTags };
}

export const videoLibraryPreset = {
  generateVideoPage,
  generateVideoLibrary,
  generateVideoSearchResults,
};
