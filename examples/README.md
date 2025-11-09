# Examples

This directory contains example usage of @uniweb/jsonld-gen.

## Files

- **basic-usage.js** - Basic usage without any framework
- **react-example.jsx** - React integration with useMetadata hook
- **preset-example.js** - Using built-in presets for common patterns
- **custom-generator.js** - Creating a custom schema generator

## Running Examples

```bash
# Install dependencies first
npm install

# Run basic example
node basic-usage.js

# For React example, integrate into your React app
```

## Integration with @uniweb/frame-bridge

The React example shows how to integrate with @uniweb/frame-bridge:

1. Generate metadata in iframe using @uniweb/jsonld-gen
2. Send to parent frame using @uniweb/frame-bridge
3. Parent injects into DOM (handled by frame-bridge)

```javascript
// In iframe
import { useMetadata } from '@uniweb/jsonld-gen/react';
import { sendToParent } from '@uniweb/frame-bridge';

useMetadata({
  // ... options
  onGenerate: (schemas, metaTags) => {
    sendToParent({
      type: 'SET_METADATA',
      payload: { schemas, metaTags }
    });
  }
});

// In parent - frame-bridge handles injection
```
