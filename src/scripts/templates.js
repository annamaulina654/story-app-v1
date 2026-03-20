import { showFormattedDate } from "./utils";

export function generateLoaderTemplate() {
  return `<div class="loader"></div>`;
}

export function generateLoaderAbsoluteTemplate() {
  return `<div class="loader loader-absolute"></div>`;
}

export function generateMainNavigationListTemplate() {
  return `
    <li><a id="story-list-button" href="#/">Beranda</a></li>
    <li><a id="about-button" href="#/about">Tentang</a></li>

  `;
}

export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li><a id="login-button" href="#/login">Masuk</a></li>
    <li><a id="register-button" href="#/register" class="btn">Daftar</a></li>
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>    
    <li><a id="new-story-button" href="#/new" class="btn"><i class="fas fa-plus"></i> Buat Cerita</a></li>
    <li><a id="logout-button" href="#/logout" class="logout-text"><i class="fas fa-sign-out-alt"></i> Keluar</a></li>
  `;
}

export function generateStoriesListEmptyTemplate() {
  return `
    <div class="empty-state">
      <h2>Belum Ada Cerita</h2>
      <p>Jadilah yang pertama membagikan momen Anda!</p>
    </div>
  `;
}

export function generateStoriesListErrorTemplate(message) {
  return `
    <div class="error-state">
      <h2>Gagal Memuat Cerita</h2>
      <p>${message || "Silakan periksa koneksi internet Anda."}</p>
    </div>
  `;
}

export function generateStoryDetailErrorTemplate(message) {
  return `
    <div class="error-state">
      <h2>Gagal Memuat Detail Cerita</h2>
      <p>${message || "Cerita mungkin telah dihapus atau koneksi terputus."}</p>
    </div>
  `;
}

export function generateStoryItemTemplate({
  id,
  name,
  description,
  photoUrl,
  createdAt,
}) {
  const dateFormatted = showFormattedDate(createdAt, "id-ID");

  return `
    <article tabindex="0" class="story-item" data-storyid="${id}">
      <div class="story-item__header">
        <div class="story-item__avatar">${name.charAt(0).toUpperCase()}</div>
        <div class="story-item__author-info">
          <h2 class="story-item__name">${name}</h2>
          <span class="story-item__date">${dateFormatted}</span>
        </div>
      </div>
      
      <div class="story-item__image-container">
        <img class="story-item__image" src="${photoUrl}" alt="Foto unggahan ${name}" loading="lazy">
      </div>
      
      <div class="story-item__body">
        <p class="story-item__description">${description}</p>
        <a class="btn btn-outline story-item__read-more" href="#/stories/${id}">Lihat Detail</a>
      </div>
    </article>
  `;
}

export function generateStoryDetailTemplate({
  name,
  description,
  photoUrl,
  createdAt,
  lat,
  lon,
}) {
  const dateFormatted = showFormattedDate(createdAt, "id-ID");

  return `
    <div class="story-detail-wrapper">
      
      <a href="#/" class="btn-back-link">
        <i class="fas fa-arrow-left"></i> Kembali ke Beranda
      </a>

      <div class="story-detail-header">
        <h1 class="story-detail-title">Cerita ${name}</h1>
        <p class="story-detail-date"><i class="fas fa-calendar-alt"></i> Diunggah pada: ${dateFormatted}</p>
      </div>

      <div class="story-detail-image-box">
        <img class="story-detail-image" src="${photoUrl}" alt="Foto dari ${name}">
      </div>

      <div class="story-detail-content">
        <h2>Deskripsi</h2>
        <p class="story-detail-description">${description}</p>
      </div>

      ${
        lat && lon
          ? `
        <div class="story-detail-map-box">
          <h2>Lokasi</h2>
          <div class="map-container-relative">
            <div id="map" class="story-detail-map"></div>
            <div id="map-loading-container"></div>
          </div>
          <p class="story-detail-coords">Latitude: ${lat} | Longitude: ${lon}</p>
        </div>
      `
          : `
        <div class="story-detail-map-box">
          <h2>Lokasi</h2>
          <div style="background: #f1f5f9; padding: 30px; border-radius: 12px; text-align: center; color: #64748b;">
            <i class="fas fa-map-marker-slash" style="font-size: 2rem; margin-bottom: 10px;"></i>
            <p>Pengguna tidak menyertakan lokasi pada cerita ini.</p>
          </div>
        </div>
      `
      }
      
      </div>
  `;
}

export function generateSubscribeButtonTemplate() {
  return `
    <button id="subscribe-button" class="btn subscribe-button">
      Subscribe <i class="fas fa-bell"></i>
    </button>
  `;
}

export function generateUnsubscribeButtonTemplate() {
  return `
    <button id="unsubscribe-button" class="btn unsubscribe-button">
      Unsubscribe <i class="fas fa-bell-slash"></i>
    </button>
  `;
}
