import LoginPresenter from "./login-presenter";
import * as DicodingStoryAPI from "../../../data/api";
import * as AuthModel from "../../../utils/auth";
import Swal from "sweetalert2";

export default class LoginPage {
  #presenter = null;

  async render() {
    return `
      <section class="auth-container">
        <article class="auth-card">
          <div class="auth-header">
            <div class="auth-icon-box">
              <i class="fas fa-user-circle"></i>
            </div>
            <h1 class="auth-title">Selamat Datang!</h1>
            <p class="auth-subtitle">Masuk untuk mulai membagikan momen berhargamu.</p>
          </div>

          <form id="login-form" class="auth-form" novalidate>
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
              <button class="btn btn-auth" type="submit">Masuk <i class="fas fa-sign-in-alt"></i></button>
            </div>
            
            <div class="auth-footer">
              <p>Belum punya akun? <a href="#/register" class="auth-link">Daftar sekarang</a></p>
            </div>
          </form>
        </article>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: DicodingStoryAPI,
      authModel: AuthModel,
    });

    this.#setupForm();
  }

  #setupForm() {
    const form = document.getElementById("login-form");
    const emailInput = document.getElementById("email-input");
    const passwordInput = document.getElementById("password-input");

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
        email: emailInput.value.trim(),
        password: passwordInput.value,
      };

      await this.#presenter.getLogin(data);
    });
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

  loginSuccessfully(message) {
    console.log(message);

    Swal.fire({
      icon: "success",
      title: "Login Berhasil!",
      text: "Selamat datang kembali di StoryApp.",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      location.hash = "/";
    });
  }

  loginFailed(message) {
    Swal.fire({
      icon: "error",
      title: "Gagal Masuk",
      text: message,
      confirmButtonColor: "#ef4444",
    });
  }

  showSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn btn-auth" type="submit" disabled>
        <i class="fas fa-spinner fa-spin"></i> Memproses...
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn btn-auth" type="submit">Masuk <i class="fas fa-sign-in-alt"></i></button>
    `;
  }
}
