# @uniweb/jsonld-gen

Generate JSON-LD schemas and Open Graph meta tags for SEO. A lightweight, framework-agnostic library with optional React integration.

## Installation

```bash
npm install @uniweb/jsonld-gen
```

## Quick Start

### Basic Usage

```javascript
import {
  createPersonSchema,
  createBreadcrumbSchema,
  composeSchemas,
  generateMetaTags,
} from "@uniweb/jsonld-gen";

// Configuration
const config = {
  baseUrl: "https://example.com",
  organizationName: "Example University",
};

// Generate schemas
const schemas = composeSchemas([
  createPersonSchema(
    {
      id: "123",
      name: "Dr. Jane Smith",
      title: "Professor of Computer Science",
      researchInterests: ["AI", "Machine Learning"],
    },
    config
  ),
  createBreadcrumbSchema(["Home", "Faculty", "Dr. Jane Smith"], config),
]);

// Generate meta tags
const metaTags = generateMetaTags(
  "person",
  {
    id: "123",
    name: "Dr. Jane Smith",
    bio: "Leading researcher in artificial intelligence...",
  },
  config
);

// Use with your framework
console.log(schemas); // Array of JSON-LD blocks
console.log(metaTags); // Object with meta tag properties
```

### React Hook

React is defined as an optional peer dependency. It must be installed in your project to use the provided hooks.

```javascript
import { useMetadata } from "@uniweb/jsonld-gen/react";
import { createPersonSchema, createBreadcrumbSchema } from "@uniweb/jsonld-gen";
import { sendToParent } from "@uniweb/frame-bridge";

function ProfilePage() {
  const { data: person, isLoading } = usePerson();

  const config = {
    baseUrl: "https://example.com",
    organizationName: "Example University",
  };

  const metadata = useMetadata({
    type: "person",
    data: person,
    isLoading,
    config,
    schemas: [
      createPersonSchema(person, config),
      createBreadcrumbSchema(["Home", "Faculty", person?.name], config),
    ],
    onGenerate: (schemas, metaTags) => {
      // Send to parent frame or inject into DOM
      sendToParent({ type: "SET_METADATA", payload: { schemas, metaTags } });
    },
  });

  return <div>...</div>;
}
```

### Using Presets

```javascript
import { universityPreset } from "@uniweb/jsonld-gen/presets/university";

const config = {
  baseUrl: "https://uottawa.ca",
  organizationName: "University of Ottawa",
};

// Expert profile page
const { schemas, metaTags } = universityPreset.generateExpertProfile(
  expertData,
  config,
  searchTerm // optional
);

// Expert search interface
const { schemas, metaTags } = universityPreset.generateExpertSearch(config);

// Expert search results
const { schemas, metaTags } = universityPreset.generateExpertSearchResults(
  results,
  searchTerm,
  config
);
```

## Available Generators

### Schema Generators

- `createPersonSchema(person, config, hooks)` - Person/Profile schema
- `createVideoSchema(video, config, hooks)` - VideoObject schema
- `createArticleSchema(article, config, hooks)` - Article schema
- `createOrganizationSchema(org, config, hooks)` - Organization schema
- `createBreadcrumbSchema(items, config, hooks)` - Breadcrumb navigation
- `createSearchActionSchema(data, config, hooks)` - Website with search

### Meta Tag Generators

- `generateMetaTags(type, data, config)` - Auto-detect and generate
- `generatePersonMetaTags(person, config)` - Person/Profile meta tags
- `generateVideoMetaTags(video, config)` - Video meta tags with OG video
- `generateSearchMetaTags(data, config)` - Search results meta tags

## Presets

### University Preset

```javascript
import { universityPreset } from "@uniweb/jsonld-gen/presets/university";
```

- `generateExpertProfile(expert, config, searchTerm)`
- `generateExpertSearch(config)`
- `generateExpertSearchResults(results, searchTerm, config)`

### Video Library Preset

```javascript
import { videoLibraryPreset } from "@uniweb/jsonld-gen/presets/video-library";
```

- `generateVideoPage(video, config)`
- `generateVideoLibrary(config)`
- `generateVideoSearchResults(results, searchTerm, config)`

### Blog Preset

```javascript
import { blogPreset } from "@uniweb/jsonld-gen/presets/blog";
```

- `generateArticle(article, config)`

## Advanced Usage

### Custom Lifecycle Hooks

```javascript
const schema = createPersonSchema(person, config, {
  beforeGenerate: (data) => {
    // Transform data before generation
    return { ...data, name: data.name.toUpperCase() };
  },
  afterGenerate: (schema) => {
    // Modify schema after generation
    schema.customField = "custom value";
    return schema;
  },
  validate: (schema) => {
    // Custom validation
    if (!schema.email) {
      console.warn("Missing email");
    }
    return true;
  },
});
```

### Server-Side Rendering (SSR)

```javascript
import { toHTML, metaTagsToHTML } from "@uniweb/jsonld-gen";

// Convert schemas to HTML
const jsonLdHTML = toHTML(schemas);

// Convert meta tags to HTML
const metaHTML = metaTagsToHTML(metaTags);

// Inject into HTML
const html = `
  <!DOCTYPE html>
  <html>
    <head>
      ${metaHTML}
      ${jsonLdHTML}
    </head>
    <body>...</body>
  </html>
`;
```

### Validation

```javascript
import { validateSchema, validateConfig } from "@uniweb/jsonld-gen";

const schemaValidation = validateSchema(schema);
if (!schemaValidation.valid) {
  console.error("Schema errors:", schemaValidation.errors);
}

const configValidation = validateConfig(config);
if (!configValidation.valid) {
  console.error("Config errors:", configValidation.errors);
}
```

## Configuration Options

```javascript
const config = {
  baseUrl: "https://example.com", // Required
  organizationName: "Example Org", // Required
  organizationLogo: "https://example.com/logo.png",
  mediaContactEmail: "media@example.com",
  mediaContactPhone: "+1-555-0100",
  defaultLanguages: ["en", "fr"],
};
```

## 🎓 Learning Path

1. **Read [GUIDE.md](GUIDE.md)** - Understand concepts
2. **Try examples** - See the [examples](./examples) directory
3. **Customize** - Use hooks for specific needs
