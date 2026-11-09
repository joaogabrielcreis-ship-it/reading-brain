// Grifo · notifications, loaded into the generated service worker (workbox importScripts).
self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "Grifo", {
    body: d.body || "", tag: d.tag || undefined, icon: "icon-192.png", badge: "icon-192.png",
    data: { url: d.url || "./" },
  }));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = new URL(e.notification.data?.url || "./", self.registration.scope).href;
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const inside = url.startsWith(self.registration.scope);
    if (inside) {
      for (const c of wins) { c.postMessage({ go: url }); if ("focus" in c) return c.focus(); }
    }
    return self.clients.openWindow(url);
  })());
});
