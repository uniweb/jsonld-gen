import { createGenerator } from '../core/generator-base.js';
import { SCHEMA_TYPES, BLOCK_IDS } from '../core/config.js';
import {
  sanitizeString,
  sanitizeUrl,
  sanitizeArray,
  buildUrl,
  formatDuration,
} from '../utils/index.js';

/**
 * Create a VideoObject schema
 * @param {Object} video - Video data
 * @param {Object} config - Configuration
 * @param {Object} [hooks] - Lifecycle hooks
 * @returns {Object|null} JSON-LD block
 */
export const createVideoSchema = createGenerator({
  type: SCHEMA_TYPES.VIDEO_OBJECT,
  id: BLOCK_IDS.VIDEO,
  priority: 1,
  generate: (video, config, hooks) => {
    const { baseUrl, organizationName, organizationLogo } = config;
    
    if (!video.id || !video.title) {
      console.warn('[Video] Missing required fields: id, title');
      return null;
    }
    
    const videoUrl = buildUrl(baseUrl, '/videos', { id: video.id });
    const embedUrl = buildUrl(baseUrl, '/embed', { id: video.id });
    
    const schema = {
      "@context": "https://schema.org",
      "@type": SCHEMA_TYPES.VIDEO_OBJECT,
      "@id": videoUrl,
      "name": sanitizeString(video.title),
      "url": videoUrl,
      "embedUrl": embedUrl,
    };
    
    if (video.description) {
      schema.description = sanitizeString(video.description);
    }
    
    const thumbnailUrl = sanitizeUrl(video.thumbnailUrl);
    if (thumbnailUrl) {
      schema.thumbnailUrl = thumbnailUrl;
    }
    
    const contentUrl = sanitizeUrl(video.videoUrl);
    if (contentUrl) {
      schema.contentUrl = contentUrl;
    }
    
    if (video.uploadDate) {
      schema.uploadDate = video.uploadDate;
    }
    
    if (video.durationSeconds) {
      schema.duration = formatDuration(video.durationSeconds);
    }
    
    if (video.width && video.height) {
      schema.width = video.width;
      schema.height = video.height;
    }
    
    // Publisher
    if (organizationName) {
      schema.publisher = {
        "@type": SCHEMA_TYPES.ORGANIZATION,
        "@id": baseUrl,
        "name": sanitizeString(organizationName),
      };
      
      if (organizationLogo) {
        schema.publisher.logo = {
          "@type": SCHEMA_TYPES.IMAGE_OBJECT,
          "url": sanitizeUrl(organizationLogo),
        };
      }
    }
    
    // Creator/Author
    if (video.creator) {
      schema.author = {
        "@type": video.creator.type || SCHEMA_TYPES.PERSON,
        "name": sanitizeString(video.creator.name),
      };
      
      const creatorUrl = sanitizeUrl(video.creator.url);
      if (creatorUrl) {
        schema.author.url = creatorUrl;
      }
    }
    
    // View count
    if (video.viewCount !== undefined) {
      schema.interactionStatistic = {
        "@type": SCHEMA_TYPES.INTERACTION_COUNTER,
        "interactionType": "https://schema.org/WatchAction",
        "userInteractionCount": video.viewCount,
      };
    }
    
    // Transcript
    if (video.transcript) {
      schema.transcript = sanitizeString(video.transcript);
    }
    
    // Keywords
    const keywords = sanitizeArray(
      video.keywords,
      20,
      (kw) => typeof kw === 'string'
    ).map(sanitizeString);
    
    if (keywords.length > 0) {
      schema.keywords = keywords.join(', ');
    }
    
    // Language
    if (video.language) {
      schema.inLanguage = video.language;
    }
    
    return schema;
  },
});
