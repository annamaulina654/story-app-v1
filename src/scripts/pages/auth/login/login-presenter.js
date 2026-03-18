export default class LoginPresenter {
  #view;
  #model;
  #authModel;

  constructor({ view, model, authModel }) {
    this.#view = view;
    this.#model = model;
    this.#authModel = authModel;
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      this.#view.showEmailError();
      return false;
    } else {
      this.#view.hideEmailError();
      return true;
    }
  }

  validatePassword(password) {
    if (!password || password.length < 8) {
      this.#view.showPasswordError();
      return false;
    } else {
      this.#view.hidePasswordError();
      return true;
    }
  }

  async getLogin({ email, password }) {
    const isEmailValid = this.validateEmail(email);
    const isPasswordValid = this.validatePassword(password);

    if (!isEmailValid || !isPasswordValid) return;

    this.#view.showSubmitLoadingButton();
    try {
      const response = await this.#model.getLogin({ email, password });

      if (response.error || !response.ok) {
        console.error("getLogin: response:", response);
        this.#view.loginFailed(response.message);
        return;
      }

      const token = response.loginResult.token;

      this.#authModel.saveAccessToken(token);

      this.#view.loginSuccessfully(response.message);
    } catch (error) {
      console.error("getLogin: error:", error);
      this.#view.loginFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
