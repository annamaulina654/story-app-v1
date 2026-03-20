self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  console.log('Service worker pushing...');

  let notificationData = {
    title: 'StoryApp',
    options: {
      body: 'Ada cerita baru yang dibagikan!',
      icon: '/images/logo.png',
      data: { id: '' }
    },
  };

  try {
    if (event.data) {
      const parsedData = event.data.json();
      notificationData.title = parsedData.title || notificationData.title;
      notificationData.options = { ...notificationData.options, ...parsedData.options };
    }
  } catch (error) {
    console.error('Error parsing push payload:', error);
  }

  const options = {
    ...notificationData.options,
    actions: [
      {
        action: 'explore',
        title: 'Buka Cerita',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('Notifikasi diklik!');
  event.notification.close();

  const payloadData = event.notification.data;
  const storyId = payloadData ? payloadData.id : null;

  const targetPath = storyId ? `/#/stories/${storyId}` : '/#/';
  const targetUrl = new URL(targetPath, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});