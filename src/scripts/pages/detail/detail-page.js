import DetailPresenter from "./detail-presenter";
import { parseActivePathname } from "../../routes/url-parser";
import Map from "../../utils/map";
import * as DicodingStoryAPI from "../../data/api";
import {
  generateLoaderAbsoluteTemplate,
  generateStoryDetailTemplate,
  generateStoryDetailErrorTemplate,
} from "../../templates";

export default class DetailPage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section class="container">
        <div class="story-detail__container">
          <div id="story-detail"></div>
          <div id="story-detail-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new DetailPresenter(parseActivePathname().id, {
      view: this,
      apiModel: DicodingStoryAPI,
    });

    this.#presenter.showStoryDetail();
  }

  populateStoryDetail(message, story) {
    document.getElementById("story-detail").innerHTML =
      generateStoryDetailTemplate(story);
  }

  populateStoryDetailError(message) {
    document.getElementById("story-detail").innerHTML =
      generateStoryDetailErrorTemplate(message);
  }

  async drawMap(lat, lon, name) {
    this.showMapLoading();
    try {
      this.#map = await Map.build("#map", {
        zoom: 15,
        center: [lat, lon],
      });

      const coordinate = [lat, lon];
      const markerOptions = { alt: `Lokasi cerita ${name}` };
      const popupOptions = { content: `Lokasi cerita <b>${name}</b>` };

      this.#map.addMarker(coordinate, markerOptions, popupOptions);
    } catch (error) {
      console.error("Gagal memuat peta:", error);
    } finally {
      this.hideMapLoading();
    }
  }

  showStoryDetailLoading() {
    document.getElementById("story-detail-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideStoryDetailLoading() {
    document.getElementById("story-detail-loading-container").innerHTML = "";
  }

  showMapLoading() {
    const container = document.getElementById("map-loading-container");
    if (container) container.innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    const container = document.getElementById("map-loading-container");
    if (container) container.innerHTML = "";
  }
}
