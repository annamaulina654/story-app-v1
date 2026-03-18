export default class LogoutPresenter {
  #view;

  constructor({ view }) {
    this.#view = view;
  }

  executeLogout() {
    setTimeout(() => {
      localStorage.clear();
      sessionStorage.clear();

      this.#view.redirectToLogin();
    }, 800);
  }
}
