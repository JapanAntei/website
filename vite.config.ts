import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  /*build: {
    rollupOptions: {
      input: {
        sample1: path.resolve(import.meta.dirname, 'src/sample1/index.html'),
        sample2: path.resolve(import.meta.dirname, 'src/sample2/index.html'),
      },
    },
  },*/
  root: 'src',
  base: '/',
  publicDir: '../public',
    build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        sample1: path.resolve(import.meta.dirname, 'src/index.html'),
        404: path.resolve(import.meta.dirname, 'src/404.html'),
        about: path.resolve(import.meta.dirname, 'src/about/index.html'),
        tetris: path.resolve(import.meta.dirname, 'src/works/tetris/index.html'),
      },
    }
  },
  resolve: {                                // ・・・・追加
    alias: {                                // ・・・・追加
      '@shared': path.resolve(import.meta.dirname, 'src/shared') // ・・・・追加
    }                                       // ・・・・追加
  },
  // 絶対パスか、`root` からの相対パスで指定する
  envDir: '../',
})
