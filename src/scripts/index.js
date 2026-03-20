import "../styles/styles.css";
import "../styles/responsives.css";
import "tiny-slider/dist/tiny-slider.css";
import "leaflet/dist/leaflet.css";

import App from "./pages/app";
import Camera from "./utils/camera";
import { registerServiceWorker } from './utils';

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.getElementById("main-content"),
    drawerButton: document.getElementById("drawer-button"),
    drawerNavigation: document.getElementById("navigation-drawer"),
    skipLinkButton: document.getElementById("skip-link"),
  });

  await registerServiceWorker();

  window.addEventListener("hashchange", async () => {
    Camera.stopAllStreams();
    await app.renderPage();
  });

  await app.renderPage();
});
