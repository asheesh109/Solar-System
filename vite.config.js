export default {
  base: '/Solar-System/', // 👈 match your GitHub repo name exactly
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
