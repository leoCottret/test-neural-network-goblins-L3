importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js"
  );
  
  // Note: Ignore the error that Glitch raises about workbox being undefined.
  workbox.setConfig({
    debug: true,
  });
  
  self.skipWaiting();
  workbox.core.clientsClaim();
  
  var CacheableResponsePlugin = workbox.cacheableResponse.CacheableResponsePlugin;
  var WorkboxBackgroundSync = workbox.backgroundSync.BackgroundSyncPlugin;
  var CacheFirst = workbox.strategies.CacheFirst;
  var ExpirationPlugin = workbox.expiration.ExpirationPlugin;
  var NavigationRoute = workbox.routing.NavigationRoute;
  var precacheAndRoute = workbox.precaching.precacheAndRoute;
  var registerRoute = workbox.routing.registerRoute;
  
  precacheAndRoute(self.__WB_MANIFEST);
  // Enable navigation preload.
  
  
  const showNotification = () => {
    self.registration.showNotification('Background sync success!', {
      body: '🎉`🎉`🎉`'
    });
  };
  
  const bgSyncPlugin = new WorkboxBackgroundSync(
    'proyect-queue',
    {
      maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes),
      callbacks: {
        queueDidReplay: showNotification
        // other types of callbacks could go here
      }
    }
  );
  
  const networkWithBackgroundSync = new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPlugin],
  });
  
  registerRoute(
    /\/api\/.*\/*.json/,
    networkWithBackgroundSync,
    'POST'
  );
  
  registerRoute(
    /\/api\/.+/,
    new CacheFirst({
      cacheName: "short-cache",
      matchOptions: {
        ignoreVary: true,
      },
      plugins: [
        new ExpirationPlugin({
          maxAgeSeconds: 300,
          purgeOnQuotaError: true,
        }),
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );
  
  registerRoute(
    /.*\.(css|js|eot|ico|svg|ttg|woff|woff2|png|jpg|jpeg|gif)/,
    new CacheFirst({
      cacheName: "max-cache",
      matchOptions: {
        ignoreVary: true,
      },
      plugins: [
        new ExpirationPlugin({
          maxAgeSeconds: 63072e3,
          purgeOnQuotaError: true,
        }),
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );
  
  self.addEventListener("push", function (event) {
    event.waitUntil(
      self.registration.showNotification("ServiceWorker Cookbook", {
        body: "Push Notification Subscription Management",
      })
    );
  });
  
  self.addEventListener("pushsubscriptionchange", function (event) {
  
    event.waitUntil(
      self.registration.pushManager
        .subscribe({ userVisibleOnly: true })
        .then(function (subscription) {
          return fetch("register", {
            method: "post",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              endpoint: subscription.endpoint,
            }),
          });
        })
    );
  });
  
  self.addEventListener("notificationclose", (event) => {
    const notification = event.notification;
    const primaryKey = notification.data.primaryKey;
  
    console.log("Closed notification: " + primaryKey);
  });
  
  self.addEventListener("notificationclick", (event) => {
    const notification = event.notification;
    const primaryKey = notification.data.primaryKey;
    const action = event.action;
  
    if (action === "close") {
      notification.close();
    } else {
      event.waitUntil(
        clients.matchAll().then((clis) => {
          const client = clis.find((c) => {
            return c.visibilityState === "visible";
          });
          if (client !== undefined) {
            client.navigate("samples/page" + primaryKey + ".html");
            client.focus();
          } else {
            // there are no visible windows. Open one.
            clients.openWindow("samples/page" + primaryKey + ".html");
            notification.close();
          }
        })
      );
    }
  
    self.registration.getNotifications().then((notifications) => {
      notifications.forEach((notification) => {
        notification.close();
      });
    });
  });
  
  self.addEventListener("push", (event) => {
    let body;
  
    if (event.data) {
      body = event.data.text();
    } else {
      body = "Default body";
    }
  
    const options = {
      body: body,
      icon: "/public/images/ico/ms-icon-512x512.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
      },
      actions: [
        {
          action: "explore",
          title: "Go to the site",
          icon: "/public/images/ok.png",
        },
        {
          action: "close",
          title: "Close the notification",
          icon: "/public/images/xmark.png",
        },
      ],
    };
    event.waitUntil(
      clients.matchAll().then((c) => {
        console.log(c);
        if (c.length === 0) {
          // Show notification
          self.registration.showNotification("Push Notification", options);
        } else {
          // Send a message to the page to update the UI
          console.log("Application is already open!");
        }
      })
    );
  });