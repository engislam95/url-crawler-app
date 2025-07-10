import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
   server: {
    port: 3000,
  },
  test: {
    environment: 'happy-dom', 
    setupFiles: './src/tests/setup.ts', 
    include: ['src/**/*.{test,spec}.{ts,tsx}']
  },
})  