import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return
          }

          if (id.includes('/three/examples/')) {
            return 'three-extras'
          }

          if (id.includes('draco3d') || id.includes('meshoptimizer')) {
            return 'three-loaders'
          }

          if (
            id.includes('/three/') ||
            id.includes('three-mesh-bvh')
          ) {
            return 'three-core'
          }

          if (
            id.includes('@react-three') ||
            id.includes('three-stdlib') ||
            id.includes('camera-controls') ||
            id.includes('@use-gesture') ||
            id.includes('@react-spring') ||
            id.includes('maath') ||
            id.includes('meshline')
          ) {
            return 'three-react'
          }

          if (
            id.includes('recharts') ||
            id.includes('victory-vendor') ||
            id.includes('recharts-scale') ||
            id.includes('/d3-') ||
            id.includes('internmap')
          ) {
            return 'charts-vendor'
          }

          if (
            id.includes('framer-motion') ||
            id.includes('motion-dom') ||
            id.includes('motion-utils')
          ) {
            return 'motion-vendor'
          }

          if (id.includes('react-router')) {
            return 'router-vendor'
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
})
