/**
 * Registers a valid service worker.
 *
 * @param {string} swUrl - url of the service worker.
 * @param {Object} [config] - functions that will trigger on success or update.
 * @param {(registration: ServiceWorkerRegistration) => void} [config.onSuccess] - after the service worker is installed successfully this callback will be called.
 * @param {(registration: ServiceWorkerRegistration) => void} [config.onUpdate] - after the service worker is updated successfully this callback will be called.
 */
 function registerValidSW(swUrl, config) {
    return navigator.serviceWorker
      .register(swUrl, { scope: "." })
      .then((registration) => {
        const egistration = registration;
  
        return (egistration.onupdatefound = () => {
          const installingWorker = registration.installing;
  
          if (!installingWorker) {
            return;
          }
  
          return (installingWorker.onstatechange = () => {
            if (installingWorker.state === "installed") {
              if (navigator.serviceWorker.controller) {
                console.log(
                  "New content is available and will be used when all "
                );
  
                if (config && config.onUpdate) {
                  config.onUpdate(registration);
                }
              } else {
                console.log("Content is cached for offline use.");
  
                if (config && config.onSuccess) {
                  config.onSuccess(registration);
                }
              }
            }
          });
        });
      })
      .catch((error) => {
        console.error("Error during service worker registration:", error);
      });
  }
  
  /**
   * Determines if the given service worker is valid or not.
   *
   * @param {string} swUrl - url of the service worker.
   * @param {Object} [config] - functions that will trigger on success or update.
   * @param {(registration: ServiceWorkerRegistration) => void} [config.onSuccess] - after the service worker is installed successfully this callback will be called.
   * @param {(registration: ServiceWorkerRegistration) => void} [config.onUpdate] - after the service worker is updated successfully this callback will be called.
   */
  function checkValidServiceWorker(swUrl, config) {
    fetch(swUrl)
      .then((response) => {
        const contentType = response.headers.get("content-type");
  
        if (
          response.status === 404 ||
          (contentType && !contentType.includes("javascript"))
        ) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        } else {
          registerValidSW(swUrl, config);
        }
      })
      .catch(() => {
        console.log(
          "No internet connection found. App is running in offline mode."
        );
      });
  }
  const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
      window.location.hostname === "[::1]" ||
      new RegExp(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/).test(
        window.location.hostname
      )
  );
  
  /**
   *
   * @param {Object} [config] - functions that will trigger on success or update.
   * @param {(registration: ServiceWorkerRegistration) => void} [config.onSuccess] - after the service worker is installed successfully this callback will be called.
   * @param {(registration: ServiceWorkerRegistration) => void} [config.onUpdate] - after the service worker is updated successfully this callback will be called.
   * @returns void
   */
  export function register(config) {
    if ("serviceWorker" in navigator) {
      const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
  
      if (publicUrl.origin !== window.location.origin) {
        return;
      }
  
      window.addEventListener("load", () => {
        const swUrl = `/service-worker.js`;
  
        if (isLocalhost) {
          checkValidServiceWorker(swUrl, config);
  
          navigator.serviceWorker.ready.then(() => {
            console.log("This web app is being served cache-first by a service ");
          });
        } else {
          registerValidSW(swUrl, config);
        }
      });
    }
  }
  
  export function unregister() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.unregister();
      });
    }
  }