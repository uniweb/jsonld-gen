/**
 * Base generator with lifecycle hooks
 * @typedef {Object} GeneratorHooks
 * @property {Function} [beforeGenerate] - Transform data before generation
 * @property {Function} [afterGenerate] - Modify schema after generation
 * @property {Function} [validate] - Custom validation
 */

/**
 * Create a schema generator with hooks support
 * @param {Object} options - Generator options
 * @param {string} options.type - Schema.org type
 * @param {string} options.id - Block ID
 * @param {number} options.priority - Priority for ordering
 * @param {Function} options.generate - Generation function
 * @returns {Function} Generator function
 */
export function createGenerator({ type, id, priority = 5, generate }) {
  /**
   * Generator function
   * @param {*} data - Input data
   * @param {Object} config - Configuration
   * @param {GeneratorHooks} [hooks] - Lifecycle hooks
   * @returns {Object} JSON-LD block
   */
  return function generator(data, config = {}, hooks = {}) {
    // Validate inputs
    if (!data) {
      console.warn(`[${type}] No data provided`);
      return null;
    }

    // Run beforeGenerate hook
    const processedData = hooks.beforeGenerate 
      ? hooks.beforeGenerate(data) 
      : data;

    // Generate schema
    let schema;
    try {
      schema = generate(processedData, config, hooks);
    } catch (error) {
      console.error(`[${type}] Generation failed:`, error);
      return null;
    }

    // Run afterGenerate hook
    const finalSchema = hooks.afterGenerate 
      ? hooks.afterGenerate(schema) 
      : schema;

    // Run validation hook
    if (hooks.validate) {
      const isValid = hooks.validate(finalSchema);
      if (!isValid) {
        console.warn(`[${type}] Schema validation failed`);
      }
    }

    // Return block with metadata
    return {
      id,
      priority,
      type,
      data: finalSchema,
    };
  };
}

/**
 * Create a JSON-LD block manually
 * @param {string} id - Block ID
 * @param {number} priority - Priority
 * @param {Object} data - JSON-LD data
 * @returns {Object} JSON-LD block
 */
export function createBlock(id, priority, data) {
  return { id, priority, data };
}
