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

    // Tangkap semua input dan error
    const nameInput = document.getElementById("name-input");
    const nameError = document.getElementById("name-error");
    const emailInput = document.getElementById("email-input");
    const emailError = document.getElementById("email-error");
    const passwordInput = document.getElementById("password-input");
    const passwordError = document.getElementById("password-error");

    const validateName = () => {
      const value = nameInput.value.trim();
      if (!value) {
        nameInput.classList.add("is-invalid");
        nameError.style.display = "flex";
        return false;
      } else {
        nameInput.classList.remove("is-invalid");
        nameError.style.display = "none";
        return true;
      }
    };

    const validateEmail = () => {
      const value = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!value || !emailRegex.test(value)) {
        emailInput.classList.add("is-invalid");
        emailError.style.display = "flex";
        return false;
      } else {
        emailInput.classList.remove("is-invalid");
        emailError.style.display = "none";
        return true;
      }
    };

    const validatePassword = () => {
      const value = passwordInput.value;
      if (!value || value.length < 8) {
        passwordInput.classList.add("is-invalid");
        passwordError.style.display = "flex";
        return false;
      } else {
        passwordInput.classList.remove("is-invalid");
        passwordError.style.display = "none";
        return true;
      }
    };

    nameInput.addEventListener("input", validateName);
    nameInput.addEventListener("blur", validateName);

    emailInput.addEventListener("input", validateEmail);
    emailInput.addEventListener("blur", validateEmail);

    passwordInput.addEventListener("input", validatePassword);
    passwordInput.addEventListener("blur", validatePassword);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isPasswordValid = validatePassword();

      if (!isNameValid) {
        nameInput.focus();
        return;
      }
      if (!isEmailValid) {
        emailInput.focus();
        return;
      }
      if (!isPasswordValid) {
        passwordInput.focus();
        return;
      }

      const data = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value,
      };
      await this.#presenter.getRegistered(data);
    });
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
