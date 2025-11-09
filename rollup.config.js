import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

const config = [
  // Main bundle
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      production && terser()
    ],
  },
  
  // React integration
  {
    input: 'src/react/index.js',
    output: {
      file: 'dist/react/index.js',
      format: 'es',
      sourcemap: true,
    },
    external: ['react'],
    plugins: [
      resolve(),
      production && terser()
    ],
  },
  
  // Presets
  {
    input: {
      'presets/index': 'src/presets/index.js',
      'presets/university': 'src/presets/university.js',
      'presets/video-library': 'src/presets/video-library.js',
      'presets/blog': 'src/presets/blog.js',
    },
    output: {
      dir: 'dist',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      production && terser()
    ],
  },
];

export default config;
