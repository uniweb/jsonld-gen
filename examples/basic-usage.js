// Basic usage example without any framework

import {
  createPersonSchema,
  createBreadcrumbSchema,
  createOrganizationSchema,
  composeSchemas,
  generateMetaTags,
  toHTML,
  metaTagsToHTML,
} from '@uniweb/jsonld-gen';

// Configuration
const config = {
  baseUrl: 'https://example.com',
  organizationName: 'Example University',
  organizationLogo: 'https://example.com/logo.png',
  mediaContactEmail: 'media@example.com',
};

// Expert data
const expert = {
  id: '123',
  name: 'Dr. Jane Smith',
  title: 'Associate Professor of Computer Science',
  bio: 'Dr. Smith is a leading researcher in artificial intelligence and machine learning.',
  researchInterests: ['Artificial Intelligence', 'Machine Learning', 'Natural Language Processing'],
  photoUrl: 'https://example.com/photos/jane-smith.jpg',
  email: 'jane.smith@example.com',
  education: [
    { institution: 'Stanford University' },
    { institution: 'MIT' },
  ],
  awards: ['Best Paper Award 2023', 'Research Excellence Award'],
};

// Generate schemas
const schemas = composeSchemas([
  createPersonSchema(expert, config),
  createBreadcrumbSchema(['Home', 'Faculty', 'Dr. Jane Smith'], config),
  createOrganizationSchema({}, config),
]);

// Generate meta tags
const metaTags = generateMetaTags('person', expert, config);

// Convert to HTML for SSR
const jsonLdHTML = toHTML(schemas);
const metaHTML = metaTagsToHTML(metaTags);

console.log('JSON-LD Schemas:', JSON.stringify(schemas, null, 2));
console.log('\nMeta Tags:', metaTags);
console.log('\nJSON-LD HTML:\n', jsonLdHTML);
console.log('\nMeta HTML:\n', metaHTML);
