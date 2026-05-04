import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(), // react가 tailwind보다 앞에 오는 것이 안전합니다.
    tailwindcss(),
  ],
});
