// vite.config.js
export default {
  base: '/Solar-System/', // 👈 IMPORTANT: Must match your repo name
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
};
