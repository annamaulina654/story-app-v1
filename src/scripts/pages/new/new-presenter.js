export default class NewPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async storeNewStory(data) {
    this.#view.showSubmitLoadingButton();
    try {
      const response = await this.#model.storeNewStory(data);

      if (response.error || !response.ok) {
        console.error("storeNewStory: response:", response);
        this.#view.storeFailed(response.message);
        return;
      }

      this.#view.storeSuccessfully(response.message);
    } catch (error) {
      console.error("storeNewStory: error:", error);
      this.#view.storeFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
