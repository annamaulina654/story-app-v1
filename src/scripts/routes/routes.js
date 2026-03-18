import HomePage from "../pages/home/home-page";
import NewPage from "../pages/new/new-page";
import LoginPage from "../pages/auth/login/login-page";
import RegisterPage from "../pages/auth/register/register-page";
import DetailPage from "../pages/detail/detail-page";
import AboutPage from "../pages/about/about-page";

import LogoutPage from "../pages/auth/logout/logout-page";

import {
  checkAuthenticatedRoute,
  checkUnauthenticatedRouteOnly,
} from "../utils/auth";

const routes = {
  "/": () => checkAuthenticatedRoute(new HomePage()),
  "/new": () => checkAuthenticatedRoute(new NewPage()),
  "/stories/:id": () => checkAuthenticatedRoute(new DetailPage()),
  "/about": () => checkAuthenticatedRoute(new AboutPage()),

  "/logout": () => new LogoutPage(),

  "/login": () => checkUnauthenticatedRouteOnly(new LoginPage()),
  "/register": () => checkUnauthenticatedRouteOnly(new RegisterPage()),
};

export default routes;
