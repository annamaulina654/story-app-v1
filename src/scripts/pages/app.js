import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import {
  generateMainNavigationListTemplate,
  generateAuthenticatedNavigationListTemplate,
  generateUnauthenticatedNavigationListTemplate,
} from "../templates";
import { getAccessToken } from "../utils/auth";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #skipLinkButton = null;

  constructor({ drawerNavigation, drawerButton, content, skipLinkButton }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = drawerNavigation;
    this.#skipLinkButton = skipLinkButton;

    this._setupDrawer();
    this._setupSkipLink();
  }

  _setupSkipLink() {
    if (this.#skipLinkButton && this.#content) {
      this.#skipLinkButton.addEventListener("click", (event) => {
        event.preventDefault();
        this.#content.focus();
        this.#content.scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  _renderNavigation() {
    try {
      console.log("Mencoba me-render navigasi...");
      const navlistMain = document.getElementById("navlist-main");
      const navlist = document.getElementById("navlist");

      if (!navlistMain || !navlist) {
        console.error(
          "Elemen navlist-main atau navlist tidak ditemukan di index.html!",
        );
        return;
      }

      navlistMain.innerHTML = generateMainNavigationListTemplate();

      const accessToken = getAccessToken();
      console.log(
        "Status Token:",
        accessToken ? "Ada Token" : "Tidak Ada Token",
      );

      if (accessToken) {
        navlist.innerHTML = generateAuthenticatedNavigationListTemplate();
      } else {
        navlist.innerHTML = generateUnauthenticatedNavigationListTemplate();
      }

      console.log("Navigasi berhasil di-render ke layar!");
    } catch (error) {
      console.error("Terjadi error saat me-render navigasi:", error);
    }
  }

  async renderPage() {
    this._renderNavigation();

    try {
      const url = getActiveRoute();
      let page = routes[url];

      if (!page) {
        console.error("Halaman tidak ditemukan untuk URL:", url);
        return;
      }

      if (typeof page === "function") {
        page = await page();
      }

      if (!page) return;

      this.#content.innerHTML = await page.render();
      await page.afterRender();
    } catch (error) {
      console.error("Terjadi error saat memuat halaman:", error);
    }
  }
}

export default App;
