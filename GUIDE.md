# Complete Guide to @uniweb/jsonld-gen

## Table of Contents

1. [Understanding JSON-LD and Structured Data](#understanding-json-ld)
2. [Understanding Open Graph](#understanding-open-graph)
3. [Why This Matters for SEO](#why-this-matters)
4. [Getting Started](#getting-started)
5. [Core Concepts](#core-concepts)
6. [Using the Library](#using-the-library)
7. [Advanced Features](#advanced-features)
8. [Best Practices](#best-practices)
9. [Common Patterns](#common-patterns)
10. [Troubleshooting](#troubleshooting)

---

## Understanding JSON-LD and Structured Data {#understanding-json-ld}

### What is JSON-LD?

**JSON-LD** (JSON for Linking Data) is a way to add structured, machine-readable data to your web pages. Think of it as **metadata that explicitly tells search engines what your content is about**, rather than making them guess from HTML.

#### Without JSON-LD
```html
<h1>Dr. Jane Smith</h1>
<p>Professor of Computer Science</p>
<p>Expert in AI and Machine Learning</p>
```

Search engines see text, but have to *infer* this is a person who works at a university.

#### With JSON-LD
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Dr. Jane Smith",
  "jobTitle": "Professor of Computer Science",
  "knowsAbout": ["AI", "Machine Learning"],
  "worksFor": {
    "@type": "Organization",
    "name": "Example University"
  }
}
</script>
```

Now search engines **know for certain** this is a person, their role, expertise, and employer.

### Schema.org Vocabulary

JSON-LD uses the **Schema.org** vocabulary - a collaborative effort by Google, Microsoft, Yahoo, and Yandex to create a common language for structured data.

Key Schema.org types this library supports:
- **Person** - People, faculty, experts
- **VideoObject** - Video content
- **Article** - Blog posts, news articles
- **Organization** - Companies, universities
- **BreadcrumbList** - Navigation hierarchy
- **WebSite** - Website-level information

### How Search Engines Use JSON-LD

Google, Bing, and other search engines use JSON-LD to:

1. **Understand Content** - Know exactly what your page represents
2. **Create Rich Results** - Display enhanced search results (star ratings, images, video thumbnails)
3. **Build Knowledge Graphs** - Connect related information across the web
4. **Improve Rankings** - Better understanding can lead to better relevance matching
5. **Enable Voice Search** - Structure makes content accessible to voice assistants

### Example: Person Rich Result

When you search for someone, Google might show:

```
Dr. Jane Smith - Professor | Example University
example.com/faculty/jane-smith

📸 [Photo]
Associate Professor of Computer Science
Areas of expertise: AI • Machine Learning • NLP
Education: Stanford University, MIT
Awards: Best Paper Award 2023

[Contact] [Research] [Publications]
```

This rich result is **powered by JSON-LD**. Without it, you'd just see a basic blue link.

---

## Understanding Open Graph {#understanding-open-graph}

### What is Open Graph?

**Open Graph** is a protocol created by Facebook that controls how your content appears when shared on social media. It's now used by:
- Facebook
- LinkedIn  
- Twitter (along with Twitter Cards)
- WhatsApp
- Slack
- Many other platforms

### Without Open Graph

When you share a link without Open Graph tags, social platforms:
- Guess the title from `<title>` tag
- Grab random text for description
- May not show an image at all
- Result: Unprofessional, unappealing preview

### With Open Graph

```html
<meta property="og:title" content="Dr. Jane Smith - Media Expert">
<meta property="og:description" content="Leading AI researcher available for media interviews...">
<meta property="og:image" content="https://example.com/photos/jane-smith.jpg">
<meta property="og:type" content="profile">
```

**Result**: Professional preview with:
- ✅ Correct title
- ✅ Compelling description
- ✅ High-quality image
- ✅ Proper content type

### Open Graph for Different Content Types

#### Profile/Person
```html
<meta property="og:type" content="profile">
<meta property="profile:first_name" content="Jane">
<meta property="profile:last_name" content="Smith">
```

#### Video
```html
<meta property="og:type" content="video.other">
<meta property="og:video" content="https://example.com/embed/video">
<meta property="og:video:width" content="1280">
<meta property="og:video:height" content="720">
```

Social platforms can embed playable videos directly in feeds!

#### Article
```html
<meta property="og:type" content="article">
<meta property="article:published_time" content="2024-01-15T10:00:00Z">
<meta property="article:author" content="Jane Smith">
```

---

## Why This Matters for SEO {#why-this-matters}

### Direct SEO Benefits

1. **Better Click-Through Rates (CTR)**
   - Rich results with images/ratings get 30-40% more clicks
   - Higher CTR signals relevance to Google → better rankings

2. **Featured Snippets**
   - Structured data increases chances of appearing in position zero
   - Voice search results pull from featured snippets

3. **Rich Results**
   - Video thumbnails in search results
   - Star ratings for reviews
   - Event dates and locations
   - Recipe cooking times

4. **Knowledge Panels**
   - Your organization/person may appear in Google's Knowledge Panel
   - Builds brand authority

### Indirect SEO Benefits

1. **Social Signals**
   - Better Open Graph → more social shares → more traffic
   - Social engagement is a ranking factor

2. **Crawl Efficiency**
   - Clear structure helps search engines crawl your site efficiently
   - They understand relationships between pages

3. **Mobile & Voice Search**
   - Structured data is crucial for voice assistants
   - Mobile search increasingly relies on structured data

### Real-World Impact

**Case Study: Faculty Directory**

*Before JSON-LD:*
- Search: "computer science expert climate change"
- Your expert appears on page 3
- Basic blue link, no image
- Low click-through rate

*After JSON-LD + Open Graph:*
- Same search
- Your expert appears on page 1
- Rich result with photo, expertise areas, contact button
- 3x higher click-through rate
- Appears in voice search results

---

## Getting Started {#getting-started}

### Installation

```bash
npm install @uniweb/jsonld-gen
```

### Basic Configuration

Every use of the library requires a configuration object:

```javascript
const config = {
  baseUrl: 'https://example.com',           // Your site's base URL
  organizationName: 'Example University',    // Your organization
  organizationLogo: 'https://example.com/logo.png', // Optional
  mediaContactEmail: 'media@example.com',    // Optional
  defaultLanguages: ['en', 'fr'],           // Optional
};
```

**Why these fields matter:**
- `baseUrl` - Used to construct canonical URLs for all schemas
- `organizationName` - Appears in Organization schemas and as publisher
- `organizationLogo` - Required for some Google rich results
- `mediaContactEmail` - Shows up in Person schemas for media contacts

### Your First Schema

Let's create a simple person schema:

```javascript
import { createPersonSchema, generateMetaTags } from '@uniweb/jsonld-gen';

// Your person data
const person = {
  id: '123',
  name: 'Dr. Jane Smith',
  title: 'Professor of Computer Science',
  bio: 'Leading researcher in AI...',
  researchInterests: ['AI', 'Machine Learning'],
  photoUrl: 'https://example.com/photos/jane-smith.jpg',
};

// Generate JSON-LD
const personSchema = createPersonSchema(person, config);

// Generate Open Graph meta tags
const metaTags = generateMetaTags('person', person, config);

console.log(personSchema);
// {
//   id: 'person',
//   priority: 1,
//   data: { "@context": "https://schema.org", "@type": "Person", ... }
// }

console.log(metaTags);
// { title: "...", ogTitle: "...", ogImage: "...", ... }
```

### Understanding the Output

#### Schema Block Structure

Every generator returns a **block** with:
- `id` - Unique identifier (e.g., 'person', 'video')
- `priority` - Order for output (lower = first)
- `data` - The actual JSON-LD schema

#### Meta Tags Object

Meta tags are returned as a flat object:
```javascript
{
  title: "Page Title",
  description: "Page description",
  canonical: "https://example.com/page",
  ogTitle: "Social Media Title",
  ogDescription: "Social Media Description",
  ogImage: "https://example.com/image.jpg",
  ogType: "profile",
  twitterCard: "summary_large_image",
  // ... more tags
}
```

---

## Core Concepts {#core-concepts}

### 1. Generators

**Generators** are functions that create JSON-LD schemas from your data.

```javascript
const personSchema = createPersonSchema(personData, config);
const videoSchema = createVideoSchema(videoData, config);
```

Each generator:
- Validates input data
- Sanitizes all strings (removes control characters)
- Builds proper Schema.org structure
- Returns a block with the schema

### 2. Composition

Most pages need **multiple schemas**. Use `composeSchemas()` to combine them:

```javascript
import { composeSchemas } from '@uniweb/jsonld-gen';

const allSchemas = composeSchemas([
  createPersonSchema(person, config),
  createBreadcrumbSchema(['Home', 'Faculty', person.name], config),
  createOrganizationSchema({}, config),
]);
```

**Why compose?**
- Different aspects of your page need different schemas
- Google recommends including multiple relevant schemas
- Breadcrumbs improve navigation understanding
- Organization schema provides context

### 3. Meta Tags

Meta tags control social sharing and browser display:

```javascript
const metaTags = generateMetaTags('person', person, config);
```

The library automatically generates:
- Standard meta tags (title, description, canonical)
- Open Graph tags (og:title, og:image, etc.)
- Twitter Card tags (twitter:card, twitter:image, etc.)
- Type-specific tags (profile:first_name for people, video:width for videos)

### 4. HTML Output (SSR)

For server-side rendering, convert schemas to HTML:

```javascript
import { toHTML, metaTagsToHTML } from '@uniweb/jsonld-gen';

const jsonLdHTML = toHTML(allSchemas);
// Returns: <script type="application/ld+json">...</script>

const metaHTML = metaTagsToHTML(metaTags);
// Returns: <meta property="og:title" content="...">
//          <meta name="description" content="...">
//          ...

// Inject into your page's <head>
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

---

## Using the Library {#using-the-library}

### Pattern 1: Simple Page (No Framework)

For a static or simple dynamic page:

```javascript
import {
  createPersonSchema,
  createBreadcrumbSchema,
  composeSchemas,
  generateMetaTags,
  toHTML,
  metaTagsToHTML,
} from '@uniweb/jsonld-gen';

function generatePageMetadata(person) {
  const config = { baseUrl: '...', organizationName: '...' };
  
  // Generate schemas
  const schemas = composeSchemas([
    createPersonSchema(person, config),
    createBreadcrumbSchema(['Home', 'People', person.name], config),
  ]);
  
  // Generate meta tags
  const metaTags = generateMetaTags('person', person, config);
  
  // Convert to HTML
  const jsonLdHTML = toHTML(schemas);
  const metaHTML = metaTagsToHTML(metaTags);
  
  // Inject into page
  document.head.insertAdjacentHTML('beforeend', jsonLdHTML);
  document.head.insertAdjacentHTML('beforeend', metaHTML);
}
```

### Pattern 2: React Application

For React apps, use the `useMetadata` hook:

```javascript
import { useMetadata } from '@uniweb/jsonld-gen/react';
import { createPersonSchema, createBreadcrumbSchema } from '@uniweb/jsonld-gen';

function PersonProfile({ personId }) {
  // Fetch your data
  const { data: person, isLoading } = useFetch(`/api/people/${personId}`);
  
  // Configuration
  const config = {
    baseUrl: 'https://example.com',
    organizationName: 'Example University',
  };
  
  // Generate and handle metadata
  useMetadata({
    type: 'person',
    data: person,
    isLoading,
    config,
    schemas: person ? [
      createPersonSchema(person, config),
      createBreadcrumbSchema(['Home', 'People', person.name], config),
    ] : [],
    onGenerate: (schemas, metaTags) => {
      // Metadata is ready - do something with it
      console.log('Generated:', schemas, metaTags);
      
      // If using iframe, send to parent
      sendToParent({ type: 'SET_METADATA', payload: { schemas, metaTags } });
    },
  });
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{person.name}</h1>
      {/* Your UI */}
    </div>
  );
}
```

**How `useMetadata` works:**
1. Watches your data for changes
2. When data loads/changes, generates new metadata
3. Calls `onGenerate` with the results
4. Prevents duplicate generations with internal caching

### Pattern 3: Using Presets

For common use cases, presets bundle everything:

```javascript
import { universityPreset } from '@uniweb/jsonld-gen/presets/university';

// Expert profile page
const { schemas, metaTags } = universityPreset.generateExpertProfile(
  expertData,
  config,
  searchTerm  // optional - if user arrived via search
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

**When to use presets:**
- Your use case matches exactly (expert directory, video library, blog)
- You want quick setup
- You don't need extensive customization

**When NOT to use presets:**
- You need custom schema types
- You want full control over structure
- Your data model differs significantly

### Pattern 4: Server-Side Rendering (Next.js, Remix, etc.)

```javascript
// pages/person/[id].jsx (Next.js example)

import { createPersonSchema, composeSchemas, toHTML, metaTagsToHTML } from '@uniweb/jsonld-gen';

export async function getServerSideProps({ params }) {
  const person = await fetchPerson(params.id);
  
  const config = { baseUrl: '...', organizationName: '...' };
  
  const schemas = composeSchemas([
    createPersonSchema(person, config),
  ]);
  
  const metaTags = generateMetaTags('person', person, config);
  
  return {
    props: {
      person,
      jsonLdHTML: toHTML(schemas),
      metaHTML: metaTagsToHTML(metaTags),
    },
  };
}

export default function PersonPage({ person, jsonLdHTML, metaHTML }) {
  return (
    <>
      <Head>
        <div dangerouslySetInnerHTML={{ __html: metaHTML }} />
        <div dangerouslySetInnerHTML={{ __html: jsonLdHTML }} />
      </Head>
      <main>
        <h1>{person.name}</h1>
        {/* Your content */}
      </main>
    </>
  );
}
```

---

## Advanced Features {#advanced-features}

### Lifecycle Hooks

Hooks let you customize the generation process at key points:

```javascript
const personSchema = createPersonSchema(
  person,
  config,
  {
    // Hook 1: Transform data BEFORE generation
    beforeGenerate: (data) => {
      console.log('Generating schema for:', data.name);
      
      // You can modify the data
      return {
        ...data,
        name: data.name.toUpperCase(), // Force uppercase names
      };
    },
    
    // Hook 2: Modify schema AFTER generation
    afterGenerate: (schema) => {
      console.log('Generated schema:', schema);
      
      // Add custom fields
      schema.customField = 'My custom value';
      
      // Or modify existing fields
      if (schema.jobTitle) {
        schema.jobTitle = `${schema.jobTitle} (Featured)`;
      }
      
      return schema;
    },
    
    // Hook 3: Validate the final schema
    validate: (schema) => {
      if (!schema.email) {
        console.warn('Person schema missing email!');
      }
      
      if (!schema.image) {
        console.error('Person schema MUST have an image!');
        return false; // Validation failed
      }
      
      return true; // Validation passed
    },
  }
);
```

**Use cases for hooks:**

**beforeGenerate:**
- Normalize data format
- Add computed fields
- Filter sensitive data
- Apply business logic

**afterGenerate:**
- Add organization-specific fields
- Inject tracking parameters
- Modify for A/B testing
- Add custom Schema.org extensions

**validate:**
- Enforce required fields
- Check data quality
- Log warnings for analytics
- Prevent invalid schemas from being used

### Creating Custom Generators

Need a schema type not included? Create your own:

```javascript
import { createGenerator } from '@uniweb/jsonld-gen';
import { sanitizeString, buildUrl } from '@uniweb/jsonld-gen';

const createEventSchema = createGenerator({
  type: 'Event',           // Schema.org type
  id: 'event',             // Unique block ID
  priority: 1,             // Output order (lower = first)
  
  generate: (event, config, hooks) => {
    // Validate required fields
    if (!event.name || !event.startDate) {
      console.warn('[Event] Missing required fields');
      return null;
    }
    
    const eventUrl = buildUrl(config.baseUrl, '/events', { id: event.id });
    
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      "@id": eventUrl,
      "name": sanitizeString(event.name),
      "startDate": event.startDate,
      "endDate": event.endDate,
      "location": {
        "@type": "Place",
        "name": sanitizeString(event.locationName),
        "address": {
          "@type": "PostalAddress",
          "streetAddress": sanitizeString(event.address),
        },
      },
      "organizer": {
        "@type": "Organization",
        "@id": config.baseUrl,
        "name": sanitizeString(config.organizationName),
      },
    };
  },
});

// Use it
const eventSchema = createEventSchema({
  id: '456',
  name: 'AI Conference 2024',
  startDate: '2024-06-15T09:00:00',
  endDate: '2024-06-17T17:00:00',
  locationName: 'Convention Center',
  address: '123 Main St, City, State',
}, config);
```

### Validation

The library includes optional validation:

```javascript
import { validateSchema, validateConfig } from '@uniweb/jsonld-gen';

// Validate a generated schema
const schemaValidation = validateSchema(personSchema.data);
if (!schemaValidation.valid) {
  console.error('Schema errors:', schemaValidation.errors);
  // ["Missing @context", "Missing name", ...]
}

// Validate your configuration
const configValidation = validateConfig(config);
if (!configValidation.valid) {
  console.error('Config errors:', configValidation.errors);
  // ["Config missing baseUrl", "baseUrl is not a valid URL"]
}
```

**Note:** Validation is basic. For production, consider using Google's [Rich Results Test](https://search.google.com/test/rich-results).

---

## Best Practices {#best-practices}

### 1. Always Include Multiple Schemas

Don't just include one schema - provide context:

```javascript
// ❌ BAD: Only person schema
const schemas = [createPersonSchema(person, config)];

// ✅ GOOD: Person + Breadcrumb + Organization
const schemas = composeSchemas([
  createPersonSchema(person, config),
  createBreadcrumbSchema(breadcrumb, config),
  createOrganizationSchema({}, config),
]);
```

**Why?** Google understands relationships. Breadcrumbs show where the person fits in your site structure. Organization provides institutional context.

### 2. Use High-Quality Images

```javascript
// ❌ BAD
photoUrl: 'https://example.com/tiny-avatar.jpg'  // 50x50px

// ✅ GOOD
photoUrl: 'https://example.com/high-res-photo.jpg'  // 1200x630px minimum
```

**Guidelines:**
- Minimum: 1200x630px for Open Graph
- Aspect ratio: 1.91:1 (landscape) or 1:1 (square)
- File size: Under 5MB
- Format: JPG or PNG (WebP for modern browsers)

### 3. Keep Descriptions Concise

```javascript
// ❌ BAD: Too long, will be truncated
description: "Dr. Smith is an incredibly accomplished researcher who has spent the last 15 years studying artificial intelligence and machine learning with a particular focus on natural language processing and computer vision with applications in healthcare and education..."

// ✅ GOOD: Concise, informative
description: "Leading AI researcher specializing in NLP and computer vision. 15 years experience in healthcare AI applications."
```

**Guidelines:**
- Meta description: 150-160 characters
- Open Graph description: 200 characters max
- Be specific and compelling

### 4. Include Breadcrumbs

Always include breadcrumb navigation:

```javascript
createBreadcrumbSchema([
  'Home',
  'Faculty',
  'Computer Science',
  person.name
], config);
```

**Benefits:**
- Helps Google understand site structure
- May appear in search results
- Improves crawlability

### 5. Use Canonical URLs

The library automatically creates canonical URLs, but ensure your config is correct:

```javascript
const config = {
  baseUrl: 'https://example.com',  // NOT http://, NOT www.example.com
  // Use your primary domain exactly as you want it indexed
};
```

### 6. Test Your Schemas

Before deploying, always test:

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
3. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
4. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

### 7. Update When Content Changes

```javascript
// ❌ BAD: Generate once, never update
useEffect(() => {
  const metadata = generateMetadata(person);
  injectMetadata(metadata);
}, []); // Empty deps - only runs once

// ✅ GOOD: Regenerate when data changes
useEffect(() => {
  const metadata = generateMetadata(person);
  injectMetadata(metadata);
}, [person]); // Regenerates when person changes
```

### 8. Handle Missing Data Gracefully

```javascript
const person = {
  name: 'Dr. Smith',
  // No photo, no bio, no research interests
};

// The library handles this - optional fields are simply omitted
const schema = createPersonSchema(person, config);
// Still generates valid schema, just with fewer fields
```

**The library automatically:**
- Skips optional fields if missing
- Sanitizes all input
- Validates required fields
- Returns null if data is invalid

---

## Common Patterns {#common-patterns}

### Pattern: University Expert Directory

```javascript
// Search interface page
const searchMetadata = universityPreset.generateExpertSearch(config);

// Search results page
const resultsMetadata = universityPreset.generateExpertSearchResults(
  results,
  searchTerm,
  config
);

// Individual expert page
const expertMetadata = universityPreset.generateExpertProfile(
  expert,
  config,
  searchTerm  // Include if they came via search
);
```

### Pattern: Video Library

```javascript
// Video player page
const videoMetadata = videoLibraryPreset.generateVideoPage(video, config);

// Video library home
const libraryMetadata = videoLibraryPreset.generateVideoLibrary(config);

// Video search results
const searchMetadata = videoLibraryPreset.generateVideoSearchResults(
  results,
  searchTerm,
  config
);
```

### Pattern: Blog Platform

```javascript
// Individual article
const articleMetadata = blogPreset.generateArticle(article, config);

// Or manually for more control
const schemas = composeSchemas([
  createArticleSchema(article, config),
  createBreadcrumbSchema(['Home', 'Blog', article.category, article.title], config),
  createOrganizationSchema({}, config),
]);

const metaTags = generateMetaTags('article', article, config);
```

### Pattern: Iframe Integration with @uniweb/frame-bridge

```javascript
// In iframe (child)
import { useMetadata } from '@uniweb/jsonld-gen/react';
import { sendToParent } from '@uniweb/frame-bridge';

function ExpertProfile() {
  const { data: expert } = useExpert();
  
  useMetadata({
    type: 'person',
    data: expert,
    config,
    schemas: [
      createPersonSchema(expert, config),
      createBreadcrumbSchema(['Home', 'Experts', expert.name], config),
    ],
    onGenerate: (schemas, metaTags) => {
      sendToParent({
        type: 'SET_METADATA',
        payload: { schemas, metaTags }
      });
    },
  });
  
  return <div>{/* Your UI */}</div>;
}

// In parent
// @uniweb/frame-bridge handles injection automatically
// No code needed in parent!
```

---

## Troubleshooting {#troubleshooting}

### Issue: Schemas not appearing in Google Rich Results Test

**Symptoms:**
- Test shows "Page is eligible for rich results" but no schemas visible
- Or "No structured data found"

**Solutions:**

1. **Check HTML output:**
   ```javascript
   console.log(toHTML(schemas));
   ```
   Ensure the `<script type="application/ld+json">` tags are present.

2. **Verify injection:**
   Open browser DevTools → Elements → Search for "application/ld+json"

3. **Check for JSON syntax errors:**
   Copy the JSON from the `<script>` tag and validate at jsonlint.com

4. **Ensure schemas are in `<head>` or top of `<body>`:**
   Google prefers structured data in the `<head>`.

### Issue: Open Graph not working on Facebook

**Symptoms:**
- Wrong image showing
- Title/description not correct

**Solutions:**

1. **Clear Facebook's cache:**
   - Go to https://developers.facebook.com/tools/debug/
   - Enter your URL
   - Click "Scrape Again"

2. **Check image requirements:**
   - Minimum 1200x630px
   - Under 5MB
   - Publicly accessible (not behind auth)
   - Use absolute URLs

3. **Verify meta tags:**
   ```javascript
   console.log(metaTagsToHTML(metaTags));
   ```

### Issue: React hook regenerating constantly

**Symptoms:**
- `onGenerate` called multiple times per second
- Performance issues

**Cause:** Data reference changing every render

**Solution:**
```javascript
// ❌ BAD: Creating new object every render
const config = {
  baseUrl: 'https://example.com',
  organizationName: 'My Org',
};

// ✅ GOOD: Stable reference
const config = useMemo(() => ({
  baseUrl: 'https://example.com',
  organizationName: 'My Org',
}), []);

useMetadata({ config, ... });
```

### Issue: Custom fields not appearing

**Problem:** You want to add custom Schema.org properties

**Solution:** Use `afterGenerate` hook:
```javascript
const schema = createPersonSchema(person, config, {
  afterGenerate: (schema) => {
    schema.award = ['Best Paper 2023'];
    schema.alumniOf = {
      "@type": "Organization",
      "name": "Stanford University"
    };
    return schema;
  }
});
```

### Issue: Validation errors

**Problem:** Google Rich Results Test shows errors

**Common errors and fixes:**

| Error | Fix |
|-------|-----|
| "Missing required field: image" | Add `photoUrl` to your person data |
| "Missing required field: datePublished" | Add `publishDate` to article data |
| "Missing required field: uploadDate" | Add `uploadDate` to video data |
| "Invalid URL in field: url" | Ensure `config.baseUrl` is correct |

### Issue: Schemas appearing but not creating rich results

**Explanation:** Not all schemas create visible rich results. Google decides when to show them based on:
- Search query relevance
- Competition for that query
- Overall page quality
- Schema completeness

**Reality check:**
- Schemas help ranking even without visible rich results
- Rich results are not guaranteed
- Focus on schema quality, not just rich results

---

## Further Reading

- **Schema.org Documentation**: https://schema.org/
- **Google Search Central - Structured Data**: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- **Open Graph Protocol**: https://ogp.me/
- **JSON-LD Playground**: https://json-ld.org/playground/

---

## Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review the examples in the `examples/` directory
3. Validate your schemas with Google's Rich Results Test
4. Check the inline JSDoc comments in the source code

---

## Summary

**JSON-LD** tells search engines what your content is about with certainty.

**Open Graph** controls how your content appears on social media.

**This library** makes both easy by:
- Providing pre-built generators for common types
- Handling all the complexity (sanitization, validation, URL building)
- Supporting customization via hooks
- Integrating seamlessly with React and iframe architectures

**The result:** Better SEO, richer search results, professional social sharing, and happier users.

Now you're ready to enhance your site's metadata! 🚀
