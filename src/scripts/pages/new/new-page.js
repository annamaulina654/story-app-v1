import NewPresenter from "./new-presenter";
import { convertBase64ToBlob } from "../../utils";
import * as DicodingStoryAPI from "../../data/api";
import { generateLoaderAbsoluteTemplate } from "../../templates";
import Camera from "../../utils/camera";
import Map from "../../utils/map";
import Swal from "sweetalert2";

export default class NewPage {
  #presenter = null;
  #form = null;
  #camera = null;
  #isCameraOpen = false;
  #takenPhoto = null;
  #map = null;

  async render() {
    return `
      <section class="new-story-header">
        <div class="container text-center">
          <h1 class="new-story-title">Bagikan Momen Anda</h1>
          <p class="new-story-description">
            Ceritakan pengalaman menarik Anda kepada dunia.<br>
            Unggah foto terbaik dan berikan cerita yang menginspirasi.
          </p>
        </div>
      </section>
    
      <section class="container" style="padding-bottom: 50px;">
        <div class="new-form-wrapper">
          <form id="new-form" class="new-story-form" novalidate>
            
            <div class="form-control">
              <label for="description-input"><i class="fas fa-pencil-alt"></i> Deskripsi</label>
              <textarea
                id="description-input"
                name="description"
                placeholder="Tuliskan deskripsi cerita Anda di sini..."
                rows="5"
                required
              ></textarea>
              <p id="description-error" class="error-message" style="display: none;">
                <i class="fas fa-exclamation-circle"></i> Deskripsi cerita tidak boleh kosong!
              </p>
            </div>

            <div class="form-control">
              <label for="documentations-input"><i class="fas fa-camera"></i> Foto Cerita (Maks 1MB)</label>
              <p class="form-help-text">Sertakan 1 foto terbaik untuk melengkapi cerita Anda.</p>
    
              <div class="file-upload-actions">
                <button id="documentations-input-button" class="btn btn-outline" type="button">
                  <i class="fas fa-upload"></i> Unggah File
                </button>
                <input
                  id="documentations-input"
                  name="photo"
                  type="file"
                  accept="image/*"
                  hidden="hidden"
                >
                <button id="open-documentations-camera-button" class="btn btn-outline" type="button">
                  <i class="fas fa-video"></i> Buka Kamera
                </button>
              </div>
              
              <div id="camera-container" class="new-form__camera__container">
                <video id="camera-video" class="new-form__camera__video">
                  Video stream not available.
                </video>
                <canvas id="camera-canvas" class="new-form__camera__canvas" style="display:none;"></canvas>
  
                <div class="new-form__camera__tools">
                  <select id="camera-select" class="camera-dropdown"></select>
                  <button id="camera-take-button" class="btn" type="button" style="width: 100%;">
                    <i class="fas fa-camera-retro"></i> Jepret
                  </button>
                </div>
              </div>
              
              <ul id="documentations-taken-list" class="new-form__documentations__outputs"></ul>
            </div>

            <div class="form-control">
              <label><i class="fas fa-map-marker-alt"></i> Lokasi (Opsional)</label>
              <p class="form-help-text">Geser pin pada peta untuk menyesuaikan lokasi kejadian.</p>
              
              <div class="map-location-container">
                <div class="new-form__location__map__container">
                  <div id="map" class="new-form__location__map"></div>
                  <div id="map-loading-container"></div>
                </div>
                
                <div class="coordinate-inputs">
                  <div class="coord-group">
                    <label for="latitude">Latitude</label>
                    <input type="text" name="latitude" id="latitude" readonly style="background-color: #f1f5f9; cursor: not-allowed; color: #475569;">
                  </div>
                  <div class="coord-group">
                    <label for="longitude">Longitude</label>
                    <input type="text" name="longitude" id="longitude" readonly style="background-color: #f1f5f9; cursor: not-allowed; color: #475569;">
                  </div>
                </div>
              </div>
            </div>

            <div class="form-buttons form-actions">
              <a class="btn btn-outline btn-cancel" href="#/">Batal</a>
              <span id="submit-button-container">
                <button class="btn btn-submit" type="submit">Bagikan Cerita <i class="fas fa-paper-plane"></i></button>
              </span>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new NewPresenter({
      view: this,
      model: DicodingStoryAPI,
    });
    this.#takenPhoto = null;

    this.#setupForm();

    this.showMapLoading();
    try {
      await this.initialMap();
    } catch (error) {
      console.error(error);
    } finally {
      this.hideMapLoading();
    }
  }

  #setupForm() {
    this.#form = document.getElementById("new-form");

    const descriptionInput = this.#form.elements.namedItem("description");

    descriptionInput.addEventListener("input", (e) =>
      this.#presenter.validateDescription(e.target.value),
    );
    descriptionInput.addEventListener("blur", (e) =>
      this.#presenter.validateDescription(e.target.value),
    );

    this.#form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = {
        description: descriptionInput.value.trim(),
        photo: this.#takenPhoto ? this.#takenPhoto.blob : null,
        lat: this.#form.elements.namedItem("latitude").value,
        lon: this.#form.elements.namedItem("longitude").value,
      };

      await this.#presenter.storeNewStory(data);
    });

    document
      .getElementById("documentations-input")
      .addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (file) {
          await this.#addTakenPicture(file);
          await this.#populateTakenPictures();
        }
      });

    document
      .getElementById("documentations-input-button")
      .addEventListener("click", () => {
        this.#form.elements.namedItem("photo").click();
      });

    const cameraContainer = document.getElementById("camera-container");
    document
      .getElementById("open-documentations-camera-button")
      .addEventListener("click", async (event) => {
        cameraContainer.classList.toggle("open");
        this.#isCameraOpen = cameraContainer.classList.contains("open");

        if (this.#isCameraOpen) {
          event.currentTarget.innerHTML =
            '<i class="fas fa-times"></i> Tutup Kamera';
          this.#setupCamera();
          await this.#camera.launch();
          return;
        }

        event.currentTarget.innerHTML =
          '<i class="fas fa-video"></i> Buka Kamera';
        this.#camera.stop();
      });
  }

  showDescriptionError() {
    document.getElementById("description-input").classList.add("is-invalid");
    document.getElementById("description-error").style.display = "block";
    document.getElementById("description-input").focus();
  }

  hideDescriptionError() {
    document.getElementById("description-input").classList.remove("is-invalid");
    document.getElementById("description-error").style.display = "none";
  }

  showPhotoMissingWarning() {
    Swal.fire({
      icon: "warning",
      title: "Foto Belum Ada",
      text: "Tolong sertakan 1 foto terbaik untuk cerita Anda!",
      confirmButtonColor: "#4f46e5",
    });
  }

  showPhotoSizeError() {
    Swal.fire({
      icon: "error",
      title: "Ukuran Terlalu Besar",
      text: "Maaf, ukuran foto maksimal adalah 1MB.",
      confirmButtonColor: "#4f46e5",
    });
  }

  async initialMap() {
    this.#map = await Map.build("#map", {
      zoom: 15,
      locate: true,
    });

    const centerCoordinate = this.#map.getCenter();
    this.#updateLatLngInput(
      centerCoordinate.latitude,
      centerCoordinate.longitude,
    );

    const draggableMarker = this.#map.addMarker(
      [centerCoordinate.latitude, centerCoordinate.longitude],
      { draggable: "true" },
    );

    draggableMarker.addEventListener("move", (event) => {
      const coordinate = event.target.getLatLng();
      this.#updateLatLngInput(coordinate.lat, coordinate.lng);
    });

    this.#map.addMapEventListener("click", (event) => {
      draggableMarker.setLatLng(event.latlng);
      this.#updateLatLngInput(event.latlng.lat, event.latlng.lng);
    });

    this.#map.addMapEventListener("move", () => {
      const currentCenter = this.#map.getCenter();

      draggableMarker.setLatLng([
        currentCenter.latitude,
        currentCenter.longitude,
      ]);

      this.#updateLatLngInput(currentCenter.latitude, currentCenter.longitude);
    });
  }

  #updateLatLngInput(latitude, longitude) {
    this.#form.elements.namedItem("latitude").value = latitude;
    this.#form.elements.namedItem("longitude").value = longitude;
  }

  #setupCamera() {
    if (!this.#camera) {
      this.#camera = new Camera({
        video: document.getElementById("camera-video"),
        cameraSelect: document.getElementById("camera-select"),
        canvas: document.getElementById("camera-canvas"),
      });
    }

    this.#camera.addCheeseButtonListener("#camera-take-button", async () => {
      const image = await this.#camera.takePicture();
      await this.#addTakenPicture(image);
      await this.#populateTakenPictures();
    });
  }

  async #addTakenPicture(image) {
    let blob = image;

    if (typeof image === "string") {
      blob = await convertBase64ToBlob(image, "image/png");
    }

    this.#takenPhoto = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      blob: blob,
    };
  }

  async #populateTakenPictures() {
    if (!this.#takenPhoto) {
      document.getElementById("documentations-taken-list").innerHTML = "";
      return;
    }

    const imageUrl = URL.createObjectURL(this.#takenPhoto.blob);
    const html = `
      <li class="new-form__documentations__outputs-item">
        <button type="button" data-deletepictureid="${this.#takenPhoto.id}" class="new-form__documentations__outputs-item__delete-btn" aria-label="Hapus Foto">
          <img src="${imageUrl}" alt="Pratinjau Foto Cerita" class="preview-img">
          <div class="delete-overlay"><i class="fas fa-trash-alt"></i> Hapus Foto</div>
        </button>
      </li>
    `;

    document.getElementById("documentations-taken-list").innerHTML = html;

    document
      .querySelector("button[data-deletepictureid]")
      .addEventListener("click", () => {
        this.#removePicture();
        this.#populateTakenPictures();
      });
  }

  #removePicture() {
    this.#takenPhoto = null;
    this.#form.elements.namedItem("photo").value = "";
  }

  storeSuccessfully(message) {
    console.log(message);
    this.clearForm();

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Cerita Anda berhasil dibagikan.",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      location.hash = "/";
    });
  }

  storeFailed(message) {
    Swal.fire({
      icon: "error",
      title: "Gagal Mengunggah cerita",
      text: message,
      confirmButtonColor: "#ef4444",
    });
  }

  clearForm() {
    this.#form.reset();
    this.#removePicture();
    this.#populateTakenPictures();
  }

  showMapLoading() {
    document.getElementById("map-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById("map-loading-container").innerHTML = "";
  }

  showSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn btn-submit" type="submit" disabled>
        <i class="fas fa-spinner fa-spin"></i> Mengunggah...
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn btn-submit" type="submit">Bagikan Cerita <i class="fas fa-paper-plane"></i></button>
    `;
  }
}
