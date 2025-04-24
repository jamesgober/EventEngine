import { defineConfig } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default defineConfig({
  input: 'src/EventFlow.js',
  output: [
    {
      file: 'dist/eventflow.cjs.js',
      format: 'cjs',
    },
    {
      file: 'dist/eventflow.esm.js',
      format: 'esm',
    }
  ],
  plugins: [resolve(), commonjs()],
});
