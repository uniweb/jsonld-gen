# @uniweb/jsonld-gen - Getting Started

## What's Included

```
jsonld-gen/
├── src/
│   ├── core/                   # Core functionality
│   │   ├── config.js          # Constants and configuration
│   │   ├── generator-base.js  # Base generator with hooks
│   │   ├── composer.js        # Schema composition & HTML output
│   │   └── validator.js       # Validation utilities
│   ├── generators/            # Pre-built schema generators
│   │   ├── person.js         # Person/Profile schema
│   │   ├── video.js          # VideoObject schema
│   │   ├── article.js        # Article schema
│   │   ├── organization.js   # Organization schema
│   │   ├── breadcrumb.js     # Breadcrumb navigation
│   │   ├── search-action.js  # Website with search
│   │   └── index.js
│   ├── meta/                  # Meta tag generators
│   │   ├── generate-meta.js  # Meta tag generation
│   │   └── index.js
│   ├── utils/                 # Utility functions
│   │   ├── sanitize.js       # Input sanitization
│   │   ├── text.js           # Text processing
│   │   ├── url.js            # URL building
│   │   ├── duration.js       # ISO 8601 duration
│   │   ├── html.js           # HTML generation
│   │   └── index.js
│   ├── react/                 # React integration (optional)
│   │   ├── use-metadata.js   # React hook
│   │   └── index.js
│   ├── presets/               # Pre-configured bundles
│   │   ├── university.js     # University/expert profiles
│   │   ├── video-library.js  # Video library pages
│   │   ├── blog.js           # Blog articles
│   │   └── index.js
│   └── index.js              # Main exports
├── examples/                  # Usage examples
│   ├── basic-usage.js
│   ├── react-example.jsx
│   ├── preset-example.js
│   ├── custom-generator.js
│   └── README.md
├── package.json
├── rollup.config.js
├── README.md
├── LICENSE
└── .gitignore
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Library

```bash
npm run build
```

This creates the `dist/` directory with bundled files.

### 3. Test It Out

```bash
node examples/basic-usage.js
```

## Usage in Your Projects

### Option A: Link Locally During Development

```bash
# In the jsonld-gen directory
npm link

# In your project directory
npm link @uniweb/jsonld-gen
```

### Option B: Publish to NPM (when ready)

```bash
# Make sure you're logged in to npm
npm login

# Publish
npm publish --access public
```

### Option C: Install from Git

```bash
npm install github:yourorg/jsonld-gen
```

## Basic Usage

```javascript
import {
  createPersonSchema,
  createBreadcrumbSchema,
  composeSchemas,
  generateMetaTags,
} from "@uniweb/jsonld-gen";

const config = {
  baseUrl: "https://example.com",
  organizationName: "Your Organization",
};

const schemas = composeSchemas([
  createPersonSchema(personData, config),
  createBreadcrumbSchema(["Home", "People", "Jane Smith"], config),
]);

const metaTags = generateMetaTags("person", personData, config);

// Send to parent frame (with @uniweb/frame-bridge)
sendToParent({
  type: "SET_METADATA",
  payload: { schemas, metaTags },
});
```

## React Integration

```javascript
import { useMetadata } from "@uniweb/jsonld-gen/react";
import { createPersonSchema } from "@uniweb/jsonld-gen";

function ProfilePage() {
  const { data, isLoading } = usePerson();

  useMetadata({
    type: "person",
    data,
    isLoading,
    config: { baseUrl: "...", organizationName: "..." },
    schemas: [createPersonSchema(data, config)],
    onGenerate: (schemas, metaTags) => {
      // Handle metadata
    },
  });

  return <div>...</div>;
}
```

## Using Presets

```javascript
import { universityPreset } from "@uniweb/jsonld-gen/presets/university";

// Expert profile
const { schemas, metaTags } = universityPreset.generateExpertProfile(
  expertData,
  config
);

// Video page
import { videoLibraryPreset } from "@uniweb/jsonld-gen/presets/video-library";

const { schemas, metaTags } = videoLibraryPreset.generateVideoPage(
  videoData,
  config
);
```

## Development

```bash
# Watch mode for development
npm run dev

# Build for production
npm run build
```

## Integration with @uniweb/frame-bridge

This library is designed to work seamlessly with @uniweb/frame-bridge:

1. **Iframe Side**: Use `@uniweb/jsonld-gen` to generate metadata
2. **Communication**: Use `@uniweb/frame-bridge` to send to parent
3. **Parent Side**: frame-bridge handles DOM injection

```javascript
// Iframe
import { useMetadata } from "@uniweb/jsonld-gen/react";
import { sendToParent } from "@uniweb/frame-bridge";

useMetadata({
  // ... config
  onGenerate: (schemas, metaTags) => {
    sendToParent({ type: "SET_METADATA", payload: { schemas, metaTags } });
  },
});
```
