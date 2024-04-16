import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import styleImport from 'vite-plugin-style-import';
import { createStyleImportPlugin } from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    createStyleImportPlugin({

    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'hack': `true; @import (reference) "${require.resolve('antd/lib/style/color/colorPalette.less')}";`,
          ...require('antd/dist/theme').default, // Ensure you include the default theme first
          ...require('antd/dist/theme').dark, // Apply dark theme variables
        },
      },
    },
  },
});