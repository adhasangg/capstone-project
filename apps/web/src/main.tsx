import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Registrasi Service Worker PWA native dengan auto-update dan auto-reload
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        // Periksa pembaruan saat tab kembali dibuka/aktif
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            void registration.update();
          }
        });
        // Pengecekan pembaruan berkala setiap 60 detik
        setInterval(() => {
          void registration.update();
        }, 60 * 1000);
      })
      .catch((err) => {
        console.warn('Gagal mendaftarkan Service Worker:', err);
      });
  });

  // Otomatis refresh halaman ketika Service Worker versi baru selesai klaim
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
