import {
  createPersonSchema,
  createOrganizationSchema,
  createBreadcrumbSchema,
  createSearchActionSchema,
} from '../generators/index.js';
import { composeSchemas } from '../core/composer.js';
import { generatePersonMetaTags, generateSearchMetaTags } from '../meta/index.js';

/**
 * Generate metadata for an expert profile page
 * @param {Object} expert - Expert data
 * @param {Object} config - Configuration
 * @param {string} [searchTerm] - Optional search term if arrived via search
 * @returns {{ schemas: Array, metaTags: Object }}
 */
export function generateExpertProfile(expert, config, searchTerm = null) {
  const breadcrumbItems = ['Home', 'Media Experts'];
  if (searchTerm) {
    breadcrumbItems.push(`Search: ${searchTerm}`);
  }
  breadcrumbItems.push(expert.name);
  
  const configWithSearchTerm = { ...config, searchTerm };
  
  const schemas = composeSchemas([
    createPersonSchema(expert, config),
    createBreadcrumbSchema(breadcrumbItems, configWithSearchTerm),
    createOrganizationSchema({}, config),
  ]);
  
  const metaTags = generatePersonMetaTags(expert, config);
  
  return { schemas, metaTags };
}

/**
 * Generate metadata for expert search interface
 * @param {Object} config - Configuration
 * @returns {{ schemas: Array, metaTags: Object }}
 */
export function generateExpertSearch(config) {
  const schemas = composeSchemas([
    createSearchActionSchema({
      name: `${config.organizationName} Media Experts`,
      description: `Find ${config.organizationName} experts for media interviews`,
      path: '/experts',
      type: 'experts'
    }, config),
    createOrganizationSchema({}, config),
  ]);
  
  const metaTags = {
    title: `Media Experts - ${config.organizationName}`,
    description: `Find ${config.organizationName} experts available for media interviews`,
    canonical: `${config.baseUrl}/experts`,
    ogTitle: `${config.organizationName} Media Experts`,
    ogDescription: `Find experts for media interviews and commentary`,
    ogType: 'website',
    ogUrl: `${config.baseUrl}/experts`,
    twitterCard: 'summary',
  };
  
  return { schemas, metaTags };
}

/**
 * Generate metadata for expert search results
 * @param {Array} results - Search results
 * @param {string} searchTerm - Search term
 * @param {Object} config - Configuration
 * @returns {{ schemas: Array, metaTags: Object }}
 */
export function generateExpertSearchResults(results, searchTerm, config) {
  const breadcrumbItems = ['Home', 'Media Experts', `Search: ${searchTerm}`];
  const configWithSearchTerm = { ...config, searchTerm };
  
  const schemas = composeSchemas([
    createBreadcrumbSchema(breadcrumbItems, configWithSearchTerm),
    createOrganizationSchema({}, config),
  ]);
  
  const metaTags = generateSearchMetaTags({
    searchTerm,
    results,
    path: '/experts'
  }, config);
  
  return { schemas, metaTags };
}

export const universityPreset = {
  generateExpertProfile,
  generateExpertSearch,
  generateExpertSearchResults,
};
