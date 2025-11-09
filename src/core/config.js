/**
 * Default configuration values
 */
export const DEFAULT_CONFIG = {
  defaultLanguages: ['en'],
  maxResultsInJsonLd: 10,
  maxExpertiseItems: 15,
  maxAwards: 5,
  maxEducation: 3,
};

/**
 * Schema.org types
 */
export const SCHEMA_TYPES = {
  PERSON: 'Person',
  ORGANIZATION: 'Organization',
  EDUCATIONAL_ORGANIZATION: 'EducationalOrganization',
  VIDEO_OBJECT: 'VideoObject',
  ARTICLE: 'Article',
  WEBSITE: 'WebSite',
  WEB_PAGE: 'WebPage',
  PROFILE_PAGE: 'ProfilePage',
  SEARCH_RESULTS_PAGE: 'SearchResultsPage',
  BREADCRUMB_LIST: 'BreadcrumbList',
  ITEM_LIST: 'ItemList',
  LIST_ITEM: 'ListItem',
  CONTACT_POINT: 'ContactPoint',
  SEARCH_ACTION: 'SearchAction',
  ENTRY_POINT: 'EntryPoint',
  IMAGE_OBJECT: 'ImageObject',
  INTERACTION_COUNTER: 'InteractionCounter',
  MEDIA_GALLERY: 'MediaGallery',
};

/**
 * JSON-LD block IDs
 */
export const BLOCK_IDS = {
  WEBSITE: 'website',
  ORGANIZATION: 'organization',
  PERSON: 'person',
  PROFILE_PAGE: 'profile-page',
  VIDEO: 'video',
  VIDEO_PAGE: 'video-page',
  ARTICLE: 'article',
  SEARCH_RESULTS: 'search-results',
  BREADCRUMB: 'breadcrumb',
  GALLERY: 'gallery',
};
