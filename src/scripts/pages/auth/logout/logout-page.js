export default class LogoutPage {
  async render() {
    return `
      <section class="container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 50vh;">
        <div class="loader"></div>
        <p style="margin-top: 20px; color: var(--text-muted); font-family: 'Poppins', sans-serif;">Sedang keluar dari akun...</p>
      </section>
    `;
  }

  async afterRender() {
    setTimeout(() => {
      localStorage.clear();
      sessionStorage.clear();

      window.location.hash = "#/login";

      window.location.reload();
    }, 800);
  }
}
