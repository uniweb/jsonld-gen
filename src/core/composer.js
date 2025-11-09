/**
 * Compose multiple schema blocks into a sorted array
 * @param {Array<Object|null>} blocks - Array of schema blocks
 * @returns {Array<Object>} Sorted array of blocks (by priority)
 */
export function composeSchemas(blocks) {
  // Filter out null/undefined blocks
  const validBlocks = blocks.filter(block => 
    block && typeof block === 'object' && block.data
  );

  // Sort by priority (lower number = higher priority = first)
  return validBlocks.sort((a, b) => a.priority - b.priority);
}

/**
 * Merge multiple schema blocks by ID (keeps last occurrence)
 * @param {Array<Object>} blocks - Array of schema blocks
 * @returns {Array<Object>} Deduplicated blocks
 */
export function deduplicateSchemas(blocks) {
  const blockMap = new Map();
  
  blocks.forEach(block => {
    if (block && block.id) {
      blockMap.set(block.id, block);
    }
  });
  
  return Array.from(blockMap.values()).sort((a, b) => a.priority - b.priority);
}

/**
 * Convert schemas to HTML script tags for SSR
 * @param {Array<Object>} blocks - Array of schema blocks
 * @returns {string} HTML string with script tags
 */
export function toHTML(blocks) {
  if (!Array.isArray(blocks)) {
    return '';
  }

  return blocks
    .filter(block => block && block.data)
    .map(block => {
      const json = JSON.stringify(block.data, null, 0);
      const escaped = json
        .replace(/</g, '\\u003c')
        .replace(/>/g, '\\u003e')
        .replace(/&/g, '\\u0026');
      
      return `<script type="application/ld+json" id="jsonld-${block.id}">${escaped}</script>`;
    })
    .join('\n');
}
