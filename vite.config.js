import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // Membuka browser otomatis saat server jalan
    port: 3000, // Opsional: tetap menggunakan port 3000 seperti CRA
  },
});