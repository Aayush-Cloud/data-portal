import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    server: {
        host: '0.0.0.0', // Accept connections from any network interface
        port: 5173, // Optional: specify the port
    },
});
