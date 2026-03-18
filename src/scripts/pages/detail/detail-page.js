import DetailPresenter from "./detail-presenter";
import { parseActivePathname } from "../../routes/url-parser";
import Map from "../../utils/map";
import * as DicodingStoryAPI from "../../data/api";
import { generateLoaderAbsoluteTemplate } from "../../templates";

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

  async populateStoryDetailAndInitialMap(message, story) {
    const date = new Date(story.createdAt).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    document.getElementById("story-detail").innerHTML = `
      <div class="story-detail-wrapper">
        
        <a href="#/" class="btn-back-link">
          <i class="fas fa-arrow-left"></i> Kembali ke Beranda
        </a>

        <div class="story-detail-header">
          <h1 class="story-detail-title">Cerita ${story.name}</h1>
          <p class="story-detail-date"><i class="fas fa-calendar-alt"></i> Diunggah pada: ${date}</p>
        </div>
        
        <div class="story-detail-image-box">
          <img class="story-detail-image" src="${story.photoUrl}" alt="Foto cerita dari ${story.name}" loading="lazy">
        </div>

        <div class="story-detail-content">
          <p class="story-detail-description">${story.description}</p>
        </div>

        ${
          story.lat && story.lon
            ? `
          <div class="story-detail-map-box">
            <h2>Lokasi</h2>
            <div class="map-container-relative">
              <div id="map" class="story-detail-map"></div>
              <div id="map-loading-container"></div>
            </div>
            <p class="story-detail-coords">Latitude: ${story.lat} | Longitude: ${story.lon}</p>
          </div>
        `
            : `
          <div class="story-detail-map-box">
            <h2>Lokasi Kejadian</h2>
            <div style="background: #f1f5f9; padding: 30px; border-radius: 12px; text-align: center; color: #64748b;">
              <i class="fas fa-map-marker-slash" style="font-size: 2rem; margin-bottom: 10px;"></i>
              <p>Pengguna tidak menyertakan lokasi pada cerita ini.</p>
            </div>
          </div>
        `
        }
        
        </div>
    `;

    if (story.lat && story.lon) {
      this.showMapLoading();
      try {
        await this.initialMap(story.lat, story.lon, story.name);
      } catch (error) {
        console.error("Gagal memuat peta:", error);
      } finally {
        this.hideMapLoading();
      }
    }
  }

  populateStoryDetailError(message) {
    document.getElementById("story-detail").innerHTML = `
      <div class="story-detail-wrapper" style="text-align: center; padding: 50px 20px;">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ef4444; margin-bottom: 20px;"></i>
        <h2 style="color: #1e293b; margin-bottom: 10px;">Gagal Memuat Cerita</h2>
        <p style="color: #64748b; margin-bottom: 30px;">${message}</p>
        <a href="#/" class="btn"><i class="fas fa-home"></i> Kembali ke Beranda</a>
      </div>
    `;
  }

  async initialMap(lat, lon, name) {
    this.#map = await Map.build("#map", {
      zoom: 15,
      center: [lat, lon],
    });

    const coordinate = [lat, lon];
    const markerOptions = { alt: `Lokasi cerita ${name}` };
    const popupOptions = { content: `Lokasi cerita <b>${name}</b>` };

    this.#map.addMarker(coordinate, markerOptions, popupOptions);
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
