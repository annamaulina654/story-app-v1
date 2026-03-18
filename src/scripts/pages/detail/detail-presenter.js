export default class DetailPresenter {
  #storyId;
  #view;
  #apiModel;

  constructor(storyId, { view, apiModel }) {
    this.#storyId = storyId;
    this.#view = view;
    this.#apiModel = apiModel;
  }

  async showStoryDetail() {
    this.#view.showStoryDetailLoading();
    try {
      const response = await this.#apiModel.getStoryById(this.#storyId);

      if (response.error || !response.ok) {
        console.error("showStoryDetail: response:", response);
        this.#view.populateStoryDetailError(response.message);
        return;
      }

      const story = response.story;
      console.log("Detail Story:", story);

      this.#view.populateStoryDetail(response.message, story);

      if (story.lat && story.lon) {
        await this.#view.drawMap(story.lat, story.lon, story.name);
      }
    } catch (error) {
      console.error("showStoryDetail: error:", error);
      this.#view.populateStoryDetailError(error.message);
    } finally {
      this.#view.hideStoryDetailLoading();
    }
  }
}
