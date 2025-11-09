/**
 * Escape HTML special characters
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (!str) return '';
  
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Convert meta tags object to HTML string
 * @param {Object} metaTags
 * @returns {string}
 */
export function metaTagsToHTML(metaTags) {
  if (!metaTags || typeof metaTags !== 'object') return '';
  
  const tags = [];
  
  // Title
  if (metaTags.title) {
    tags.push(`<title>${escapeHtml(metaTags.title)}</title>`);
  }
  
  // Standard meta tags
  if (metaTags.description) {
    tags.push(`<meta name="description" content="${escapeHtml(metaTags.description)}">`);
  }
  
  if (metaTags.canonical) {
    tags.push(`<link rel="canonical" href="${escapeHtml(metaTags.canonical)}">`);
  }
  
  // Open Graph tags
  const ogMapping = {
    ogTitle: 'og:title',
    ogDescription: 'og:description',
    ogType: 'og:type',
    ogUrl: 'og:url',
    ogImage: 'og:image',
    ogImageAlt: 'og:image:alt',
    ogImageWidth: 'og:image:width',
    ogImageHeight: 'og:image:height',
    ogVideo: 'og:video',
    ogVideoUrl: 'og:video:url',
    ogVideoSecureUrl: 'og:video:secure_url',
    ogVideoType: 'og:video:type',
    ogVideoWidth: 'og:video:width',
    ogVideoHeight: 'og:video:height',
    ogProfileFirstName: 'profile:first_name',
    ogProfileLastName: 'profile:last_name',
  };
  
  Object.entries(ogMapping).forEach(([key, property]) => {
    if (metaTags[key]) {
      tags.push(`<meta property="${property}" content="${escapeHtml(metaTags[key])}">`);
    }
  });
  
  // Twitter Card tags
  const twitterMapping = {
    twitterCard: 'twitter:card',
    twitterTitle: 'twitter:title',
    twitterDescription: 'twitter:description',
    twitterImage: 'twitter:image',
    twitterImageAlt: 'twitter:image:alt',
    twitterPlayer: 'twitter:player',
    twitterPlayerWidth: 'twitter:player:width',
    twitterPlayerHeight: 'twitter:player:height',
    twitterPlayerStream: 'twitter:player:stream',
    twitterPlayerStreamContentType: 'twitter:player:stream:content_type',
  };
  
  Object.entries(twitterMapping).forEach(([key, name]) => {
    if (metaTags[key]) {
      tags.push(`<meta name="${name}" content="${escapeHtml(metaTags[key])}">`);
    }
  });
  
  return tags.join('\n');
}
