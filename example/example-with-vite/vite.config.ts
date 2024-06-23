import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { PushRemoteEntryOptions, timekeeperVitePlugin } from 'timekeeper-plugin/dist'
import federation from "@originjs/vite-plugin-federation";

const current = new Date(Date.now());
const year = current.getFullYear().toString();
const month = (current.getMonth() + 1).toString().padStart(2, '0');
const day = current.getDate().toString().padStart(2, '0');
const hours = current.getHours().toString().padStart(2, '0');
const minutes = current.getMinutes().toString().padStart(2, '0');

const moduleVersion = `${year}_${month}_${day}__${hours}_${minutes}`;

// https://vitejs.dev/config/
export default defineConfig(async () => {
  return {
    plugins: [
      react(),
      federation({
        name: "exampleVite",
        filename: `${moduleVersion}.remoteEntry.js`,
        exposes: {
          './Navbar': './src/components/Navbar.tsx'
        },
        remotes: {
          exampleWebpack: {
            external: await timekeeperVitePlugin().getRemoteEntry({
              remoteName: 'exampleWebpack',
              version: 'latest',
              apiUrl: 'http://localhost:8080',
              baseUrl: 'http://localhost:7777/file/',
              fallbackUrl: 'http://localhost:7777/file/2024_06_19__13_47.remoteEntry.js',
              timeout: 0
            }),
            format: "var",
            externalType: "url"
          },
        },
        shared: ['react', 'react-dom'],
      }),
      timekeeperVitePlugin({
        remoteName: 'exampleVite',
        version: moduleVersion,
        apiUrl: "http://localhost:8080",
        baseUrl: "http://localhost:7777/file/",
        environment: "production",
      } as PushRemoteEntryOptions)
    ],
    server: {
      port: 5001
    },
    build: {
      target: 'esnext',
    },
  }
})
