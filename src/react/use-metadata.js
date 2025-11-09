import { useEffect, useRef, useMemo } from 'react';
import { composeSchemas } from '../core/composer.js';
import { generateMetaTags } from '../meta/index.js';

/**
 * Hook to generate metadata (JSON-LD + meta tags)
 * @param {Object} options - Hook options
 * @param {string} options.type - Content type ('person', 'video', 'search')
 * @param {*} options.data - Content data
 * @param {boolean} [options.isLoading] - Whether data is loading
 * @param {Object} options.config - Configuration
 * @param {Array} [options.schemas] - Pre-generated schema blocks
 * @param {Function} [options.onGenerate] - Callback when metadata is generated
 * @returns {{ schemas: Array, metaTags: Object } | null}
 */
export function useMetadata(options) {
  const { type, data, isLoading, config, schemas: customSchemas, onGenerate } = options;
  const lastDataRef = useRef(null);
  const lastResultRef = useRef(null);
  
  const metadata = useMemo(() => {
    // Don't generate if loading or no data
    if (isLoading || !data) {
      return null;
    }
    
    // Check if data changed (simple JSON comparison)
    const dataStr = JSON.stringify(data);
    if (lastDataRef.current === dataStr) {
      return lastResultRef.current;
    }
    
    try {
      // Use custom schemas if provided, otherwise empty array
      const schemas = customSchemas ? composeSchemas(customSchemas) : [];
      
      // Generate meta tags
      const metaTags = generateMetaTags(type, data, config);
      
      const result = { schemas, metaTags };
      
      lastDataRef.current = dataStr;
      lastResultRef.current = result;
      
      return result;
    } catch (error) {
      console.error('[useMetadata] Error generating metadata:', error);
      return null;
    }
  }, [type, data, isLoading, config, customSchemas]);
  
  // Call onGenerate when metadata changes
  useEffect(() => {
    if (metadata && onGenerate) {
      onGenerate(metadata.schemas, metadata.metaTags);
    }
  }, [metadata, onGenerate]);
  
  return metadata;
}

/**
 * Hook that returns a metadata generator function
 * Useful for manual control over when metadata is generated
 * @param {Object} config - Configuration
 * @returns {Function} Generator function
 */
export function useMetadataGenerator(config) {
  return useMemo(() => {
    return (type, data, customSchemas = []) => {
      if (!data) return null;
      
      const schemas = composeSchemas(customSchemas);
      const metaTags = generateMetaTags(type, data, config);
      
      return { schemas, metaTags };
    };
  }, [config]);
}
