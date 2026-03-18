import RegisterPresenter from "./register-presenter";
import * as DicodingStoryAPI from "../../../data/api";
import Swal from "sweetalert2";

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
      <section class="auth-container">
        <article class="auth-card">
          <div class="auth-header">
            <div class="auth-icon-box">
              <i class="fas fa-user-plus"></i>
            </div>
            <h1 class="auth-title">Buat Akun Baru</h1>
            <p class="auth-subtitle">Bergabunglah dan mulai bagikan cerita inspiratifmu ke dunia.</p>
          </div>

          <form id="register-form" class="auth-form" novalidate>
            <div class="form-group">
              <label for="name-input"><i class="fas fa-user"></i> Nama Lengkap</label>
              <input 
                id="name-input" 
                type="text" 
                name="name" 
                placeholder="Masukkan nama lengkap Anda" 
                required
              >
              <p id="name-error" class="error-message" style="display: none;">
                <i class="fas fa-exclamation-circle"></i> Nama lengkap tidak boleh kosong!
              </p>
            </div>

            <div class="form-group">
              <label for="email-input"><i class="fas fa-envelope"></i> Email</label>
              <input 
                id="email-input" 
                type="email" 
                name="email" 
                placeholder="nama@email.com" 
                required
              >
              <p id="email-error" class="error-message" style="display: none;">
                <i class="fas fa-exclamation-circle"></i> Format email tidak valid!
              </p>
            </div>

            <div class="form-group">
              <label for="password-input"><i class="fas fa-lock"></i> Password</label>
              <input 
                id="password-input" 
                type="password" 
                name="password" 
                placeholder="Minimal 8 karakter" 
                minlength="8" 
                required
              >
              <p id="password-error" class="error-message" style="display: none;">
                <i class="fas fa-exclamation-circle"></i> Password minimal 8 karakter!
              </p>
            </div>

            <div id="submit-button-container" class="auth-action">
              <button class="btn btn-auth" type="submit">Daftar Akun <i class="fas fa-arrow-right"></i></button>
            </div>
            
            <div class="auth-footer">
              <p>Sudah punya akun? <a href="#/login" class="auth-link">Masuk di sini</a></p>
            </div>
          </form>
        </article>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: DicodingStoryAPI,
    });

    this.#setupForm();
  }

  #setupForm() {
    const form = document.getElementById("register-form");
    const nameInput = document.getElementById("name-input");
    const emailInput = document.getElementById("email-input");
    const passwordInput = document.getElementById("password-input");

    nameInput.addEventListener("input", (e) =>
      this.#presenter.validateName(e.target.value),
    );
    nameInput.addEventListener("blur", (e) =>
      this.#presenter.validateName(e.target.value),
    );

    emailInput.addEventListener("input", (e) =>
      this.#presenter.validateEmail(e.target.value),
    );
    emailInput.addEventListener("blur", (e) =>
      this.#presenter.validateEmail(e.target.value),
    );

    passwordInput.addEventListener("input", (e) =>
      this.#presenter.validatePassword(e.target.value),
    );
    passwordInput.addEventListener("blur", (e) =>
      this.#presenter.validatePassword(e.target.value),
    );

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value,
      };

      await this.#presenter.getRegistered(data);
    });
  }

  showNameError() {
    document.getElementById("name-input").classList.add("is-invalid");
    document.getElementById("name-error").style.display = "flex";
  }

  hideNameError() {
    document.getElementById("name-input").classList.remove("is-invalid");
    document.getElementById("name-error").style.display = "none";
  }

  showEmailError() {
    document.getElementById("email-input").classList.add("is-invalid");
    document.getElementById("email-error").style.display = "flex";
  }

  hideEmailError() {
    document.getElementById("email-input").classList.remove("is-invalid");
    document.getElementById("email-error").style.display = "none";
  }

  showPasswordError() {
    document.getElementById("password-input").classList.add("is-invalid");
    document.getElementById("password-error").style.display = "flex";
  }

  hidePasswordError() {
    document.getElementById("password-input").classList.remove("is-invalid");
    document.getElementById("password-error").style.display = "none";
  }

  registeredSuccessfully(message) {
    Swal.fire({
      icon: "success",
      title: "Pendaftaran Berhasil!",
      text: "Akun Anda berhasil dibuat. Silakan masuk untuk melanjutkan.",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      location.hash = "/login";
    });
  }

  registeredFailed(message) {
    Swal.fire({
      icon: "error",
      title: "Gagal Mendaftar",
      text: message,
      confirmButtonColor: "#ef4444",
    });
  }

  showSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn btn-auth" type="submit" disabled>
        <i class="fas fa-spinner fa-spin"></i> Mendaftarkan...
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn btn-auth" type="submit">Daftar Akun <i class="fas fa-arrow-right"></i></button>
    `;
  }
}
