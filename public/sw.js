self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  const payload = event.data.json();
  const title = payload.title || "Sanabi Kids";
  const options = {
    body: payload.body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    data: {
      href: payload.href || "/admin/pedidos",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const href = event.notification.data?.href || "/admin/pedidos";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client) {
          client.navigate(href);
          return client.focus();
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(href);
      }
    }),
  );
});
