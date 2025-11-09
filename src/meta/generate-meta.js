import { sanitizeString, truncateText, sanitizeUrl, buildUrl } from '../utils/index.js';

/**
 * Generate meta tags for person/profile pages
 * @param {Object} person - Person data
 * @param {Object} config - Configuration
 * @returns {Object} Meta tags
 */
export function generatePersonMetaTags(person, config) {
  const { baseUrl, organizationName } = config;
  const url = buildUrl(baseUrl, '/experts', { id: person.id });
  
  const name = sanitizeString(person.name);
  const title = `${name} - ${organizationName} Media Expert`;
  
  let description;
  if (person.bio) {
    description = truncateText(person.bio, 160);
  } else if (person.researchInterests?.length > 0) {
    const expertise = person.researchInterests.slice(0, 3).join(', ');
    description = `${name}, ${person.title || 'expert'} at ${organizationName}. Available for media interviews on ${expertise}.`;
  } else {
    description = `${name} is available for media interviews.`;
  }
  
  const photoUrl = sanitizeUrl(person.photoUrl || person.image);
  
  return {
    title: sanitizeString(title),
    description: truncateText(description, 160),
    canonical: url,
    ogTitle: sanitizeString(`${name} - ${organizationName}`),
    ogDescription: truncateText(description, 200),
    ogType: 'profile',
    ogUrl: url,
    ...(photoUrl && {
      ogImage: photoUrl,
      ogImageAlt: `Photo of ${name}`,
    }),
    ...(person.firstName && { ogProfileFirstName: sanitizeString(person.firstName) }),
    ...(person.lastName && { ogProfileLastName: sanitizeString(person.lastName) }),
    twitterCard: 'summary_large_image',
    twitterTitle: sanitizeString(title),
    twitterDescription: truncateText(description, 200),
    ...(photoUrl && {
      twitterImage: photoUrl,
      twitterImageAlt: `Photo of ${name}`,
    }),
  };
}

/**
 * Generate meta tags for video pages
 * @param {Object} video - Video data
 * @param {Object} config - Configuration
 * @returns {Object} Meta tags
 */
export function generateVideoMetaTags(video, config) {
  const { baseUrl } = config;
  const videoUrl = buildUrl(baseUrl, '/videos', { id: video.id });
  const embedUrl = buildUrl(baseUrl, '/embed', { id: video.id });
  
  const title = sanitizeString(video.title);
  const description = truncateText(video.description, 160);
  const thumbnailUrl = sanitizeUrl(video.thumbnailUrl);
  
  return {
    title,
    description,
    canonical: videoUrl,
    ogTitle: title,
    ogDescription: truncateText(video.description, 200),
    ogType: 'video.other',
    ogUrl: videoUrl,
    ...(thumbnailUrl && {
      ogImage: thumbnailUrl,
      ogImageAlt: `Thumbnail for ${title}`,
    }),
    ogVideo: embedUrl,
    ogVideoUrl: embedUrl,
    ogVideoSecureUrl: embedUrl,
    ogVideoType: 'text/html',
    ogVideoWidth: video.width || 1280,
    ogVideoHeight: video.height || 720,
    twitterCard: 'player',
    twitterTitle: title,
    twitterDescription: truncateText(video.description, 200),
    ...(thumbnailUrl && {
      twitterImage: thumbnailUrl,
      twitterImageAlt: `Thumbnail for ${title}`,
    }),
    twitterPlayer: embedUrl,
    twitterPlayerWidth: video.width || 1280,
    twitterPlayerHeight: video.height || 720,
  };
}

/**
 * Generate meta tags for search results
 * @param {Object} data - Search data
 * @param {Object} config - Configuration
 * @returns {Object} Meta tags
 */
export function generateSearchMetaTags(data, config) {
  const { baseUrl, organizationName } = config;
  const { searchTerm, results = [] } = data;
  
  const url = buildUrl(baseUrl, data.path || '/experts', { term: searchTerm });
  const title = `${searchTerm} - Search Results`;
  const description = `${results.length} results found for "${searchTerm}" at ${organizationName}`;
  
  return {
    title: sanitizeString(title),
    description: truncateText(description, 160),
    canonical: url,
    ogTitle: sanitizeString(title),
    ogDescription: truncateText(description, 200),
    ogType: 'website',
    ogUrl: url,
    twitterCard: 'summary',
    twitterTitle: sanitizeString(title),
    twitterDescription: truncateText(description, 200),
  };
}

/**
 * Generate meta tags based on content type
 * @param {string} type - Content type ('person', 'video', 'search', etc.)
 * @param {Object} data - Content data
 * @param {Object} config - Configuration
 * @returns {Object} Meta tags
 */
export function generateMetaTags(type, data, config) {
  switch (type) {
    case 'person':
      return generatePersonMetaTags(data, config);
    case 'video':
      return generateVideoMetaTags(data, config);
    case 'search':
      return generateSearchMetaTags(data, config);
    default:
      console.warn(`Unknown meta tag type: ${type}`);
      return {};
  }
}
