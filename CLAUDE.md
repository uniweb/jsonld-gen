# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@uniweb/jsonld-gen` is a library that generates JSON-LD schemas and Open Graph meta tags for SEO from data objects. It provides type-based generators (Person, Article, VideoObject, etc.), framework-agnostic utilities, React hooks, and presets for common scenarios like university profiles and video libraries.

**Key Use Case:** Enable search engines to index content inside iframes by passing JSON-LD and meta tags from child to parent via `@uniweb/frame-bridge` or vanilla postMessage.

## Development Commands

### Build and Development
```bash
npm run build       # Build production bundle with Rollup
npm run dev         # Watch mode for development
```

The build outputs to `dist/` with separate bundles for:
- Main bundle: `dist/index.js`
- React integration: `dist/react/index.js`
- Presets: `dist/presets/*.js`

React is an optional peer dependency. The library works without React, but React hooks require React 18+.

## Architecture

### Core System

The library follows a **generator-based architecture** with lifecycle hooks:

1. **Generator Base** (`src/core/generator-base.js`)
   - `createGenerator()` - Factory function that creates schema generators with hook support
   - Generators accept `(data, config, hooks)` and return schema blocks with metadata: `{ id, priority, type, data }`
   - **Lifecycle hooks:** `beforeGenerate`, `afterGenerate`, `validate`

2. **Composer** (`src/core/composer.js`)
   - `composeSchemas()` - Combines multiple schema blocks, sorts by priority
   - `toHTML()` - Converts blocks to `<script type="application/ld+json">` tags for SSR

3. **Config** (`src/core/config.js`)
   - Defines `SCHEMA_TYPES` (Person, VideoObject, etc.)
   - Defines `BLOCK_IDS` for deduplication
   - Contains `DEFAULT_CONFIG` with limits (max expertise items, education, etc.)

### Schema Generators (`src/generators/`)

Each generator is created with `createGenerator()` and follows this pattern:
- Takes `(data, config, hooks)`
- Validates required fields (e.g., person requires `id` and `name`)
- Uses utilities to sanitize and build URLs
- Returns JSON-LD schema conforming to schema.org

**Available generators:**
- `person.js` - Person/Profile schema (priority: 1)
- `video.js` - VideoObject schema
- `article.js` - Article schema
- `organization.js` - Organization schema
- `breadcrumb.js` - BreadcrumbList schema
- `search-action.js` - WebSite with SearchAction

### Meta Tag Generation (`src/meta/`)

Separate from JSON-LD schemas. Generates Open Graph and Twitter Card tags.

- `generate-meta.js` - Type-based dispatcher and specific generators
- Returns plain objects with meta tag properties (title, ogTitle, ogImage, etc.)
- `metaTagsToHTML()` utility in `src/utils/html.js` converts to `<meta>` tags

### React Integration (`src/react/`)

- `useMetadata()` - Main hook that generates schemas and meta tags, calls `onGenerate` callback
- `useMetadataGenerator()` - Returns a generator function for manual control
- Both hooks use `useMemo` to prevent unnecessary regeneration

**Pattern:** The `onGenerate` callback is where you inject into DOM or send to parent frame:
```javascript
onGenerate: (schemas, metaTags) => {
  // Inject into DOM, send via postMessage, etc.
}
```

### Presets (`src/presets/`)

Pre-configured functions that combine generators for common scenarios:
- `university.js` - Expert profiles, search interfaces
- `video-library.js` - Video pages, video libraries
- `blog.js` - Article pages

Each preset returns `{ schemas, metaTags }`.

### Utilities (`src/utils/`)

- `sanitize.js` - Input sanitization (strings, URLs, emails, arrays)
- `html.js` - HTML escaping and tag generation
- `url.js` - URL building with query parameters
- `duration.js` - ISO 8601 duration formatting
- `text.js` - Name parsing, text truncation

## Key Patterns and Conventions

### Schema Block Structure
All generators return blocks with this structure:
```javascript
{
  id: 'person',          // From BLOCK_IDS
  priority: 1,           // Lower = higher priority in output
  type: 'Person',        // Schema.org type
  data: { /* actual JSON-LD */ }
}
```

### Sanitization
Always use sanitization utilities before adding data to schemas:
- `sanitizeString()` - Trims and validates strings
- `sanitizeUrl()` - Validates and normalizes URLs
- `sanitizeEmail()` - Validates email format
- `sanitizeArray()` - Filters, limits, and validates arrays

### URL Building
Use `buildUrl(baseUrl, path, params)` from `src/utils/url.js` for all URLs in schemas:
```javascript
const url = buildUrl(baseUrl, '/experts', { id: person.id });
// Returns: https://example.com/experts?id=jane-smith
```

### Error Handling
Generators log warnings for missing required fields but return `null` instead of throwing:
```javascript
if (!person.id || !person.name) {
  console.warn('[Person] Missing required fields: id, name');
  return null;
}
```

### Configuration
All functions expect a config object with at minimum:
- `baseUrl` - Required, base URL for the site
- `organizationName` - Required, organization name

Optional config:
- `organizationLogo` - Logo URL
- `mediaContactEmail` - Contact email for schemas
- `defaultLanguages` - Language codes for availableLanguage

## frame-bridge Integration

When using with `@uniweb/frame-bridge`:

**Child (iframe):** Use `messenger.updateJSONLD(schema)` for schemas (built-in frame-bridge support). Send meta tags via custom action:
```javascript
schemas.forEach(schema => messenger.updateJSONLD(schema));
messenger.sendToParent('updateMetaTags', { metaTags });
```

**Parent:** frame-bridge auto-injects JSON-LD (default behavior). Handle meta tags via custom `actionHandlers`:
```javascript
const messenger = new ParentMessenger({
  jsonLD: true,  // Default, auto-injects JSON-LD from child
  actionHandlers: {
    updateMetaTags: (iframeId, { metaTags }) => {
      // Inject meta tags with tracking
    }
  }
});
```

Note: frame-bridge's `updateJSONLD()` handles one schema at a time, so iterate over schemas array.

## Testing During Development

There are example files in `examples/` that demonstrate usage:
- `basic-usage.js` - Core API usage
- `react-example.jsx` - React hook usage
- `preset-example.js` - Using presets
- `custom-generator.js` - Creating custom generators

Run examples by importing and executing in a Node environment or browser console after building.

## Common Modifications

### Adding a New Schema Generator

1. Create file in `src/generators/`
2. Use `createGenerator()` with type, id, priority, and generate function
3. Add to `SCHEMA_TYPES` and `BLOCK_IDS` in `src/core/config.js`
4. Export from `src/generators/index.js`
5. Export from `src/index.js`

### Adding a New Meta Tag Type

1. Add generator function in `src/meta/generate-meta.js`
2. Add case to `generateMetaTags()` switch statement
3. Export new function from `src/meta/index.js`

### Adding a New Preset

1. Create file in `src/presets/`
2. Import necessary generators
3. Export functions that return `{ schemas, metaTags }`
4. Add entry to `rollup.config.js` presets input
5. Add export path in `package.json` exports field

## Important Notes

- All generators are **pure functions** - they don't modify input data
- Schemas include `@context` only on the top-level schema (first in array)
- The library is **framework-agnostic** - React integration is optional
- SSR is supported via `toHTML()` and `metaTagsToHTML()` utilities
- **Validation is advisory** - schemas are still returned even if validation fails
