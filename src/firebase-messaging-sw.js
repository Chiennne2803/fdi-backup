/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDz0poBxYkKKiP6XmpR-L1cJ5xu_nxPQUg",
  authDomain: "linkfiin-c93b6.firebaseapp.com",
  projectId: "linkfiin-c93b6",
  storageBucket: "linkfiin-c93b6.firebasestorage.app",
  messagingSenderId: "213900917255",
  appId: "1:213900917255:web:d386491b5c9bb2997048a2",
  measurementId: "G-570C8VBM07"
});

const messaging = firebase.messaging();

// 🔹 Xử lý background message
messaging.onBackgroundMessage((payload) => {
  console.log('📦 [firebase-messaging-sw.js] Background message:', payload);

  const title = payload.notification?.title || 'LINKFIIN - Thông báo';
  const body = payload.notification?.body || 'Bạn có thông báo mới!';
  const data = payload.data || {};

  // 🔔 Hiển thị notification
  self.registration.showNotification(title, {
    body,
    icon: '/icon.png',
    data
  });

  // 📮 Gửi message về các tab Angular đang mở
  self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'FCM_BACKGROUND',
        data,
        notification: payload.notification
      });
    });
  });
});

// ✅ Fallback cho Edge: Bắt sự kiện push thủ công
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const payload = event.data.json();

  const title = payload.notification?.title || 'LINKFIIN - Thông báo';
  const body = payload.notification?.body || 'Bạn có thông báo mới!';

  const notificationOptions = {
    body,
    icon: '/icon.png',
    data: payload.data || {},
  };

  event.waitUntil(self.registration.showNotification(title, notificationOptions));
});
