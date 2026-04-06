// types/login.d.ts
import { LoginPage } from "../pages/login";
import { Page } from "@playwright/test";

export type LoginFixtures = {
  page: Page;
  loginPage: LoginPage;
};

export type LoginResponse = {
  status: () => number;
};
