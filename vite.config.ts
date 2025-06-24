import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  const apiKeyFromBuildEnv = env.API_KEY || process.env.API_KEY;

  // Debug logging
  console.log(`[VITE_CONFIG_DEBUG] Running in mode: ${mode}`);
  console.log('[VITE_CONFIG_DEBUG] Attempting to read API_KEY from environment');
  
  if (apiKeyFromBuildEnv) {
    console.log('[VITE_CONFIG_DEBUG] API_KEY found in build environment. Length:', apiKeyFromBuildEnv.length);
    console.log('[VITE_CONFIG_DEBUG] API_KEY will be injected into the application bundle.');
  } else {
    console.error('[VITE_CONFIG_DEBUG] CRITICAL: API_KEY is UNDEFINED or EMPTY in the build environment!');
    console.error('[VITE_CONFIG_DEBUG] The application will NOT be able to initialize the Gemini API client.');
  }

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(apiKeyFromBuildEnv)
    }
  };
});