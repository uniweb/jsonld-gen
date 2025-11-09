# JSON-LD and OG Tags Generator

Generate JSON-LD schemas and Open Graph meta tags from your data objects.

## The Problem

Search engines need structured data to properly index and display your content. This requires:

- **JSON-LD schemas** - Structured data that describes your content (Person, Article, VideoObject, etc.)
- **Open Graph tags** - Social media sharing metadata
- **Consistent formatting** - Same structure across all pages

Writing this metadata manually is tedious and error-prone:

```html
<!-- Manual approach: verbose, repetitive, easy to make mistakes -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://example.com/faculty/jane-smith",
    "name": "Dr. Jane Smith",
    "jobTitle": "Professor of Computer Science",
    "url": "https://example.com/faculty/jane-smith",
    "sameAs": [
      "https://twitter.com/janesmith",
      "https://linkedin.com/in/janesmith"
    ],
    "knowsAbout": ["AI", "Machine Learning"],
    "affiliation": {
      "@type": "Organization",
      "name": "Example University",
      "url": "https://example.com"
    }
  }
</script>
<meta
  property="og:title"
  content="Dr. Jane Smith - Professor of Computer Science"
/>
<meta
  property="og:description"
  content="Leading researcher in artificial intelligence..."
/>
<meta property="og:url" content="https://example.com/faculty/jane-smith" />
<meta property="og:type" content="profile" />
<!-- ...and many more tags -->
```

## The Solution

Generate structured data automatically from your existing data objects:

```javascript
import { createPersonSchema, generateMetaTags } from "@uniweb/jsonld-gen";

// Your data object
const person = {
  id: "jane-smith",
  name: "Dr. Jane Smith",
  title: "Professor of Computer Science",
  bio: "Leading researcher in artificial intelligence...",
  researchInterests: ["AI", "Machine Learning"],
  socialMedia: {
    twitter: "janesmith",
    linkedin: "janesmith",
  },
};

// Generate schemas and meta tags
const schemas = [createPersonSchema(person, config)];
const metaTags = generateMetaTags("person", person, config);

// Done! Inject into <head> or pass to parent frame
```

No manual JSON-LD writing. No inconsistencies. Type-safe and validated.

## Features

- **Type-based generators** - Person, Article, VideoObject, Organization, Breadcrumbs, and more
- **Open Graph support** - Automatic OG tag generation for social sharing
- **Framework-agnostic** - Works with any JavaScript framework or vanilla JS
- **React hooks** - Optional React integration with `useMetadata` hook
- **SSR-friendly** - Generate HTML strings for server-side rendering
- **Presets** - Pre-configured generators for common scenarios (university profiles, video libraries, blogs)
- **Iframe integration** - Works seamlessly with `@uniweb/frame-bridge` for embedded applications
- **Lifecycle hooks** - Transform, validate, and customize generated schemas
- **Validation** - Built-in schema validation

## Installation

```bash
npm install @uniweb/jsonld-gen
```

## Quick Start

### Basic Usage (Client-Side)

```javascript
import {
  createPersonSchema,
  createBreadcrumbSchema,
  composeSchemas,
  generateMetaTags,
  toHTML,
  metaTagsToHTML,
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
      id: "jane-smith",
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
    id: "jane-smith",
    name: "Dr. Jane Smith",
    bio: "Leading researcher in artificial intelligence...",
  },
  config
);

// Inject into DOM
document.head.insertAdjacentHTML("beforeend", toHTML(schemas));
document.head.insertAdjacentHTML("beforeend", metaTagsToHTML(metaTags));
```

### React Hook

React is defined as an optional peer dependency. Install React in your project to use the provided hooks.

```javascript
import { useMetadata } from "@uniweb/jsonld-gen/react";
import { createPersonSchema, createBreadcrumbSchema } from "@uniweb/jsonld-gen";

function ProfilePage() {
  const { data: person, isLoading } = usePerson();

  const config = {
    baseUrl: "https://example.com",
    organizationName: "Example University",
  };

  useMetadata({
    type: "person",
    data: person,
    isLoading,
    config,
    schemas: [
      createPersonSchema(person, config),
      createBreadcrumbSchema(["Home", "Faculty", person?.name], config),
    ],
    onGenerate: (schemas, metaTags) => {
      // Automatically injected into <head>
      console.log("Metadata updated");
    },
  });

  return <div>...</div>;
}
```

### Server-Side Rendering (SSR)

```javascript
import {
  createPersonSchema,
  generateMetaTags,
  toHTML,
  metaTagsToHTML,
} from "@uniweb/jsonld-gen";

// In your server route handler
app.get("/faculty/:id", async (req, res) => {
  const person = await fetchPerson(req.params.id);

  const schemas = [createPersonSchema(person, config)];
  const metaTags = generateMetaTags("person", person, config);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        ${metaTagsToHTML(metaTags)}
        ${toHTML(schemas)}
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  `;

  res.send(html);
});
```

## Use Cases

### Iframe Applications with frame-bridge

When embedding applications in iframes, search engines can't index content inside the frame. Use `jsonld-gen` with `@uniweb/frame-bridge` to pass metadata from the iframe to the parent:

**Child (iframe):**

```javascript
import { useMetadata } from "@uniweb/jsonld-gen/react";
import { createPersonSchema } from "@uniweb/jsonld-gen";

function ExpertProfile() {
  const { data: expert } = useExpert();

  useMetadata({
    type: "person",
    data: expert,
    config,
    schemas: [createPersonSchema(expert, config)],
    onGenerate: (schemas, metaTags) => {
      // Send to parent frame for SEO
      window.FrameBridge.sendToParent("updateMetadata", {
        schemas,
        metaTags,
      });
    },
  });

  return <div>...</div>;
}
```

**Parent:**

```javascript
import { ParentMessenger } from "@uniweb/frame-bridge/parent";
import { toHTML, metaTagsToHTML } from "@uniweb/jsonld-gen";

const messenger = new ParentMessenger({
  actionHandlers: {
    updateMetadata: (iframeId, { schemas, metaTags }) => {
      // Inject metadata from iframe into parent <head>
      const existingJsonLd = document.querySelectorAll(
        `script[type="application/ld+json"][data-iframe-id="${iframeId}"]`
      );
      existingJsonLd.forEach((el) => el.remove());

      document.head.insertAdjacentHTML("beforeend", toHTML(schemas, iframeId));

      // Update OG tags
      const existingMeta = document.querySelectorAll(
        `meta[data-iframe-id="${iframeId}"]`
      );
      existingMeta.forEach((el) => el.remove());

      const metaHTML = metaTagsToHTML(metaTags).replace(
        /<meta /g,
        `<meta data-iframe-id="${iframeId}" `
      );
      document.head.insertAdjacentHTML("beforeend", metaHTML);

      return { success: true };
    },
  },
});
```

Result: Search engines index the iframe content as if it were native to the parent page.

### Static Site Generation

```javascript
import { createPersonSchema, generateMetaTags } from "@uniweb/jsonld-gen";
import fs from "fs";

// Generate pages at build time
const people = await fetchAllPeople();

people.forEach((person) => {
  const schemas = [createPersonSchema(person, config)];
  const metaTags = generateMetaTags("person", person, config);

  const html = generatePageHTML(person, schemas, metaTags);
  fs.writeFileSync(`./dist/faculty/${person.id}.html`, html);
});
```

### University Expert Profiles

```javascript
import { universityPreset } from "@uniweb/jsonld-gen/presets/university";

// Expert profile page
const { schemas, metaTags } = universityPreset.generateExpertProfile(
  expertData,
  config,
  searchTerm // optional, for breadcrumb context
);

// Expert search results
const { schemas, metaTags } = universityPreset.generateExpertSearchResults(
  results,
  searchTerm,
  config
);
```

### Video Libraries

```javascript
import { videoLibraryPreset } from "@uniweb/jsonld-gen/presets/video-library";

// Video page with full schema
const { schemas, metaTags } = videoLibraryPreset.generateVideoPage(
  videoData,
  config
);
```

### Blog Posts

```javascript
import { blogPreset } from "@uniweb/jsonld-gen/presets/blog";

// Article with full schema
const { schemas, metaTags } = blogPreset.generateArticle(articleData, config);
```

## Available Generators

### Schema Generators

All schema generators accept three parameters: `(data, config, hooks?)`

- `createPersonSchema(person, config, hooks)` - Person/Profile schema
- `createVideoSchema(video, config, hooks)` - VideoObject schema
- `createArticleSchema(article, config, hooks)` - Article schema
- `createOrganizationSchema(org, config, hooks)` - Organization schema
- `createBreadcrumbSchema(items, config, hooks)` - BreadcrumbList schema
- `createSearchActionSchema(data, config, hooks)` - WebSite with SearchAction

**Example:**

```javascript
const schema = createPersonSchema(
  {
    id: "jane-smith",
    name: "Dr. Jane Smith",
    title: "Professor",
    bio: "Research in AI...",
    email: "jane@example.com",
    phone: "+1-555-0100",
    researchInterests: ["AI", "ML"],
    socialMedia: {
      twitter: "janesmith",
      linkedin: "janesmith",
    },
  },
  config
);
```

### Meta Tag Generators

- `generateMetaTags(type, data, config)` - Auto-detect type and generate
- `generatePersonMetaTags(person, config)` - Person/Profile meta tags
- `generateVideoMetaTags(video, config)` - Video meta tags with OG video tags
- `generateSearchMetaTags(data, config)` - Search results meta tags

**Example:**

```javascript
const metaTags = generatePersonMetaTags(
  {
    name: "Dr. Jane Smith",
    title: "Professor",
    bio: "Research in AI...",
    image: "https://example.com/images/jane-smith.jpg",
  },
  config
);

// Returns:
// {
//   title: "Dr. Jane Smith - Professor",
//   description: "Research in AI...",
//   ogTitle: "Dr. Jane Smith - Professor",
//   ogDescription: "Research in AI...",
//   ogUrl: "https://example.com/faculty/jane-smith",
//   ogType: "profile",
//   ogImage: "https://example.com/images/jane-smith.jpg",
//   ...
// }
```

## Presets

### University Preset

Pre-configured generators for academic/research institutions:

```javascript
import { universityPreset } from "@uniweb/jsonld-gen/presets/university";

// Expert profile page
const { schemas, metaTags } = universityPreset.generateExpertProfile(
  expert,
  config,
  searchTerm
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

### Video Library Preset

```javascript
import { videoLibraryPreset } from "@uniweb/jsonld-gen/presets/video-library";

// Video page
const { schemas, metaTags } = videoLibraryPreset.generateVideoPage(
  video,
  config
);

// Video library home
const { schemas, metaTags } = videoLibraryPreset.generateVideoLibrary(config);

// Video search results
const { schemas, metaTags } = videoLibraryPreset.generateVideoSearchResults(
  results,
  searchTerm,
  config
);
```

### Blog Preset

```javascript
import { blogPreset } from "@uniweb/jsonld-gen/presets/blog";

// Article page
const { schemas, metaTags } = blogPreset.generateArticle(article, config);
```

## Advanced Features

### Custom Lifecycle Hooks

Transform data before generation, modify schemas after generation, or add custom validation:

```javascript
const schema = createPersonSchema(person, config, {
  beforeGenerate: (data) => {
    // Transform data before generation
    return {
      ...data,
      name: data.name.toUpperCase(),
    };
  },
  afterGenerate: (schema) => {
    // Modify schema after generation
    schema.customField = "custom value";
    return schema;
  },
  validate: (schema) => {
    // Custom validation
    if (!schema.email) {
      console.warn("Missing email for person:", schema.name);
    }
    return true;
  },
});
```

### Schema Composition

Combine multiple schemas for complex pages:

```javascript
import { composeSchemas } from "@uniweb/jsonld-gen";

const schemas = composeSchemas([
  createPersonSchema(person, config),
  createBreadcrumbSchema(["Home", "Faculty", person.name], config),
  createOrganizationSchema(organization, config),
]);

// Returns: [{ @context, @type: "Person", ... }, { @type: "BreadcrumbList", ... }, ...]
```

### Validation

```javascript
import { validateSchema, validateConfig } from "@uniweb/jsonld-gen";

// Validate a schema
const schemaValidation = validateSchema(schema);
if (!schemaValidation.valid) {
  console.error("Schema errors:", schemaValidation.errors);
}

// Validate configuration
const configValidation = validateConfig(config);
if (!configValidation.valid) {
  console.error("Config errors:", configValidation.errors);
}
```

### HTML Utilities

```javascript
import { toHTML, metaTagsToHTML } from "@uniweb/jsonld-gen";

// Convert schemas to HTML
const jsonLdHTML = toHTML(schemas);
// Returns: <script type="application/ld+json">...</script>

// With iframe ID for frame-bridge
const jsonLdHTML = toHTML(schemas, "iframe-1");
// Returns: <script type="application/ld+json" data-iframe-id="iframe-1">...</script>

// Convert meta tags to HTML
const metaHTML = metaTagsToHTML(metaTags);
// Returns: <meta property="og:title" content="..." /> ...
```

## Configuration Options

```javascript
const config = {
  // Required
  baseUrl: "https://example.com",
  organizationName: "Example Organization",

  // Optional
  organizationLogo: "https://example.com/logo.png",
  mediaContactEmail: "media@example.com",
  mediaContactPhone: "+1-555-0100",
  defaultLanguages: ["en", "fr"],
};
```

## API Reference

### Schema Generators

#### `createPersonSchema(person, config, hooks?)`

**Parameters:**

- `person` - Person data object
  - `id` (required) - Unique identifier
  - `name` (required) - Full name
  - `title` - Job title
  - `bio` - Biography
  - `email` - Email address
  - `phone` - Phone number
  - `image` - Profile image URL
  - `researchInterests` - Array of research areas
  - `socialMedia` - Object with social media handles
- `config` - Configuration object
- `hooks` - Optional lifecycle hooks

**Returns:** JSON-LD Person schema

#### `createVideoSchema(video, config, hooks?)`

**Parameters:**

- `video` - Video data object
  - `id` (required) - Unique identifier
  - `name` (required) - Video title
  - `description` - Video description
  - `thumbnailUrl` - Thumbnail image URL
  - `uploadDate` - ISO date string
  - `duration` - ISO 8601 duration (e.g., "PT5M30S")
  - `contentUrl` - Video file URL
  - `embedUrl` - Embed player URL

**Returns:** JSON-LD VideoObject schema

#### `createArticleSchema(article, config, hooks?)`

**Parameters:**

- `article` - Article data object
  - `id` (required) - Unique identifier
  - `headline` (required) - Article title
  - `description` - Article description
  - `author` - Author name or object
  - `datePublished` - ISO date string
  - `dateModified` - ISO date string
  - `image` - Article image URL

**Returns:** JSON-LD Article schema

#### `createBreadcrumbSchema(items, config, hooks?)`

**Parameters:**

- `items` - Array of breadcrumb labels
- `config` - Configuration object

**Returns:** JSON-LD BreadcrumbList schema

### Meta Tag Generators

#### `generateMetaTags(type, data, config)`

**Parameters:**

- `type` - Content type: `"person"`, `"video"`, `"article"`, or `"search"`
- `data` - Data object matching the type
- `config` - Configuration object

**Returns:** Object with meta tag properties

#### `generatePersonMetaTags(person, config)`

#### `generateVideoMetaTags(video, config)`

#### `generateSearchMetaTags(data, config)`

Type-specific generators. Same return format as `generateMetaTags`.

### Utilities

#### `composeSchemas(schemas)`

Compose multiple schemas into an array.

#### `toHTML(schemas, iframeId?)`

Convert schemas to HTML `<script type="application/ld+json">` tags.

#### `metaTagsToHTML(metaTags)`

Convert meta tags object to HTML `<meta>` tags.

#### `validateSchema(schema)`

Validate a JSON-LD schema. Returns `{ valid, errors }`.

#### `validateConfig(config)`

Validate configuration object. Returns `{ valid, errors }`.

## Browser Support

- Modern browsers with ES6+ support
- Node.js 14+ for SSR

## License

MIT © Proximify

## Contributing

Contributions are welcome! Please open an issue or PR.

## Related Libraries

- [`@uniweb/frame-bridge`](https://www.npmjs.com/package/@uniweb/frame-bridge) - Iframe communication and URL synchronization
