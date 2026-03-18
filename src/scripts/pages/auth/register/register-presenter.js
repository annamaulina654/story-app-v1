export default class RegisterPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  validateName(name) {
    if (!name) {
      this.#view.showNameError();
      return false;
    } else {
      this.#view.hideNameError();
      return true;
    }
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

  async getRegistered({ name, email, password }) {
    const isNameValid = this.validateName(name);
    const isEmailValid = this.validateEmail(email);
    const isPasswordValid = this.validatePassword(password);

    if (!isNameValid || !isEmailValid || !isPasswordValid) return;

    this.#view.showSubmitLoadingButton();
    try {
      const response = await this.#model.getRegistered({
        name,
        email,
        password,
      });

      if (response.error || !response.ok) {
        console.error("getRegistered: response:", response);
        this.#view.registeredFailed(response.message);
        return;
      }

      this.#view.registeredSuccessfully(response.message);
    } catch (error) {
      console.error("getRegistered: error:", error);
      this.#view.registeredFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
