import { LoginPage } from "../pages/login";
import { Page } from "@playwright/test";

export type LoginFixtures = {
  page: Page;
  loginPage: LoginPage;
};

export type LoginResponse = {
  status: () => number;
};

export type LoginErrorField = "email" | "password" | "global";

export type LoginCase = {
  id: string;
  desc: string;
  email: string;
  password: string;
  type: "ui" | "api";
  field?: LoginErrorField;
  errorMess?: string;
};
