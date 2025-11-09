# @uniweb/jsonld-gen - Complete Package Summary

## 🎯 What It Does

Generates structured data (JSON-LD) and meta tags for:

- ✅ Person/Expert profiles
- ✅ Video content (YouTube-style)
- ✅ Articles/Blog posts
- ✅ Organizations
- ✅ Breadcrumb navigation
- ✅ Search interfaces
- ✅ Custom schemas

## 🏗️ Architecture

```
@uniweb/jsonld-gen
│
├── Core (Zero dependencies)
│   ├── Generator base with lifecycle hooks
│   ├── Schema composition
│   ├── Validation
│   └── HTML/SSR support
│
├── Generators (Pre-built)
│   ├── Person
│   ├── Video
│   ├── Article
│   ├── Organization
│   ├── Breadcrumb
│   └── SearchAction
│
├── Meta Tags
│   ├── Open Graph
│   ├── Twitter Cards
│   └── Standard meta tags
│
├── React Integration (Optional)
│   └── useMetadata hook with auto-updates
│
└── Presets (Common patterns)
    ├── University (expert profiles)
    ├── Video Library
    └── Blog
```

## 📥 Files Included

### Core Files

- `src/core/` - Generator base, composer, validator, config
- `src/utils/` - Sanitization, URL building, duration formatting, HTML generation
- `src/generators/` - Person, Video, Article, Organization, Breadcrumb, SearchAction
- `src/meta/` - Meta tag generation for all types
- `src/react/` - React hooks (optional)
- `src/presets/` - Pre-configured bundles

### Configuration

- `package.json` - Ready to publish
- `rollup.config.js` - Build configuration
- `.gitignore` - Git ignore rules

### Documentation

- `README.md` - Complete API documentation
- `examples/` - 4 complete usage examples
- `GETTING_STARTED.md` - Quick start guide (in outputs)

## 🚀 Quick Start

```bash
# Install & Build
npm install
npm run build

# Test
node examples/basic-usage.js
```

## 💻 Usage

### Basic

```javascript
import {
  createPersonSchema,
  composeSchemas,
  generateMetaTags,
} from "@uniweb/jsonld-gen";

const schemas = composeSchemas([
  createPersonSchema(person, config),
  // ... more schemas
]);

const metaTags = generateMetaTags("person", person, config);
```

### React

```javascript
import { useMetadata } from "@uniweb/jsonld-gen/react";

useMetadata({
  type: "person",
  data: person,
  config,
  schemas: [createPersonSchema(person, config)],
  onGenerate: (schemas, metaTags) => {
    // Send to parent via @uniweb/frame-bridge
  },
});
```

### Presets

```javascript
import { universityPreset } from "@uniweb/jsonld-gen/presets/university";

const { schemas, metaTags } = universityPreset.generateExpertProfile(
  expert,
  config
);
```

## 🔧 Integration with @uniweb/frame-bridge

Perfect separation of concerns:

1. **@uniweb/jsonld-gen** - Generates metadata (this library)
2. **@uniweb/frame-bridge** - Handles communication & injection

```javascript
// Iframe side
import { useMetadata } from "@uniweb/jsonld-gen/react";
import { sendToParent } from "@uniweb/frame-bridge";

useMetadata({
  // ... config
  onGenerate: (schemas, metaTags) => {
    sendToParent({
      type: "SET_METADATA",
      payload: { schemas, metaTags },
    });
  },
});

// Parent side
// frame-bridge handles injection automatically
```

## 🎨 Use Cases

Perfect for:

- ✅ University expert directories
- ✅ Video libraries
- ✅ Blog platforms
- ✅ E-commerce product pages
- ✅ Event listings
- ✅ Course catalogs
- ✅ Any SEO-critical content

## 📚 Additional Documentation

All documentation is included:

- README.md - Full API reference
- GUIDE.md - Understand concepts (30 min)
- Examples - 4 complete examples
- JSDoc comments - Inline documentation
