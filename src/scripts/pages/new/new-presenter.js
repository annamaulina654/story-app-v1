export default class NewPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  validateDescription(description) {
    if (!description) {
      this.#view.showDescriptionError();
      return false;
    } else {
      this.#view.hideDescriptionError();
      return true;
    }
  }

  validatePhoto(photo) {
    if (!photo) {
      this.#view.showPhotoMissingWarning();
      return false;
    }

    if (photo.size > 1000000) {
      this.#view.showPhotoSizeError();
      return false;
    }

    return true;
  }

  async storeNewStory(data) {
    const isDescriptionValid = this.validateDescription(data.description);

    if (!isDescriptionValid) return;

    const isPhotoValid = this.validatePhoto(data.photo);

    if (!isPhotoValid) return;

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
