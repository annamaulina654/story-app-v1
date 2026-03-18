import LogoutPresenter from "./logout-presenter";

export default class LogoutPage {
  #presenter = null;

  async render() {
    return `
      <section class="container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 50vh;">
        <div class="loader"></div>
        <p style="margin-top: 20px; color: var(--text-muted); font-family: 'Poppins', sans-serif;">Sedang keluar dari akun...</p>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new LogoutPresenter({ view: this });

    this.#presenter.executeLogout();
  }

  redirectToLogin() {
    window.location.hash = "#/login";
    window.location.reload();
  }
}
