import {
  createArticleSchema,
  createOrganizationSchema,
  createBreadcrumbSchema,
} from '../generators/index.js';
import { composeSchemas } from '../core/composer.js';
import { sanitizeString, truncateText, sanitizeUrl, buildUrl } from '../utils/index.js';

/**
 * Generate metadata for a blog article
 * @param {Object} article - Article data
 * @param {Object} config - Configuration
 * @returns {{ schemas: Array, metaTags: Object }}
 */
export function generateArticle(article, config) {
  const breadcrumbItems = ['Home', 'Blog', article.title];
  
  const schemas = composeSchemas([
    createArticleSchema(article, config),
    createBreadcrumbSchema(breadcrumbItems, config),
    createOrganizationSchema({}, config),
  ]);
  
  const articleUrl = buildUrl(config.baseUrl, '/articles', { id: article.id });
  const title = sanitizeString(article.title);
  const description = truncateText(article.description, 160);
  const imageUrl = sanitizeUrl(article.imageUrl);
  
  const metaTags = {
    title,
    description,
    canonical: articleUrl,
    ogTitle: title,
    ogDescription: truncateText(article.description, 200),
    ogType: 'article',
    ogUrl: articleUrl,
    ...(imageUrl && {
      ogImage: imageUrl,
      ogImageAlt: title,
    }),
    ...(article.publishDate && { articlePublishedTime: article.publishDate }),
    ...(article.modifiedDate && { articleModifiedTime: article.modifiedDate }),
    ...(article.author && { articleAuthor: article.author.name }),
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: truncateText(article.description, 200),
    ...(imageUrl && {
      twitterImage: imageUrl,
      twitterImageAlt: title,
    }),
  };
  
  return { schemas, metaTags };
}

export const blogPreset = {
  generateArticle,
};
