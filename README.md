# 🚀 Playwright Training Plan - Practice 3

**Date:** Apr 1, 2026

---

## 📌 OVERVIEW

This document provides the Playwright Automation Testing training plan.

The goal of this training is to practice **UI Testing** and **API Testing** using Playwright on the demo application:

👉 https://demo-saas.bugbug.io/

- **Timeline:** 7 working days
- **Start date:** Apr 1, 2026
- **Estimation + Test case listing:** 1 day
- **End date:** Apr 10, 2026

---

## 🎯 TARGETS

- Implement end-to-end automation tests using Playwright
- Combine UI tests with API tests
- Create test data using API before running UI tests
- Verify API responses (status code & response data)
- Automate CRUD operations
- Automate table interactions
- Validate sorting and searching
- Write maintainable test cases

---

## 🧰 PREREQUISITE

### 📦 Framework

- Basic knowledge of a JS/TS framework (React, Angular, etc.)

### 💻 Operating System

- Windows 10+, Windows Server 2016+, or WSL
- macOS 13 Ventura or later
- Linux: Debian 12, Ubuntu 22.04 / 24.04 (x86-64 & arm64)

### 🟢 Node.js

- Version: 18 / 20 / 22 (recommended latest LTS)

### 📦 Package Manager

- npm / yarn / pnpm

### 🧑‍💻 IDE

- Visual Studio Code

> 📝 **Note:** System requirements follow official Playwright documentation.

---

## 📚 DETAIL PLAN

### 1. 🎯 PLAYWRIGHT FUNDAMENTALS

📖 https://playwright.dev/docs/intro

- Playwright introduction
- Writing first test
- Selectors
- Test structure
- Fixtures
- Locators
- Handling forms
- Handling tables
- Handling file uploads

---

### 2. 🔌 API TESTING WITH PLAYWRIGHT

📖 https://playwright.dev/docs/api-testing

- APIRequestContext
- API authentication
- Sending GET / POST / DELETE requests
- Verifying status code
- Verifying response body
- Using Axios API client

📌 Reference:

- Playwright Todo List example

---

## 🧪 PRACTICES (7 DAYS)

### 📍 PRACTICE 3

Test the demo application:

👉 https://demo-saas.bugbug.io/

---

## 🧩 FEATURES TO COVER

### 🔐 Authentication

- Verify user can login to the application

### 📝 Ticket Management

- Create new ticket
- Edit ticket

### 🔍 Search & Filter

- Search by title
- Filter by status

### 📊 Table Interactions

- Sort by title
- Pagination

### 👤 Account Management

- Update manager account

### 🚪 Logout

- Verify user can logout

---

## 📋 TEST CASES

- Test case list: https://docs.google.com/spreadsheets/d/1PqNMjWSPHNQVTwb7PdGCxz4oOtciuSxiDLA4EvU3C2Q/edit?pli=1&gid=2006143589#gid=2006143589

---

## 💡 EXPECTED OUTPUT

- Fully working Playwright test suite
- Clean architecture (Fixtures + Page Object + API layer)
- Stable tests (no flaky behavior)
- Reusable utilities and helpers
- Proper test tagging (`@smoke`, `@regression`, `@api`, `@ui`)

---

## 🏁 FINAL GOAL

By the end of this practice, you should be able to:

✅ Build a complete Playwright automation framework  
✅ Combine UI + API testing effectively  
✅ Handle real-world scenarios (table, search, CRUD, pagination)  
✅ Write clean, maintainable, and scalable tests

---

## ⚙️ INSTALLATION & SETUP

| Purpose                 | Command                                                                        |
| ----------------------- | ------------------------------------------------------------------------------ |
| 📄 Clone                | `git clone git@gitlab.asoft-python.com:ha.nguyenthanh/playwright-training.git` |
| 📦 Install dependencies | `pnpm install`                                                                 |
| 🌐 Install browsers     | `npx playwright install`                                                       |
| ▶️ Run all tests        | `pnpm test`                                                                    |
| 🌍 Run chromium only    | `pnpm test --project=chromium`                                                 |
| 🔐 Run auth tests       | `pnpm test --project=auth`                                                     |
| 🏷 Run by tag           | `pnpm test -g "@smoke"`                                                        |
| 👀 Headed mode          | `pnpm test --headed`                                                           |
| 🐞 Debug mode           | `pnpm test --debug`                                                            |
| 🎯 Run specific file    | `pnpm test tests/login.spec.ts`                                                |
| 🎯 Run specific line    | `pnpm test tests/login.spec.ts:10`                                             |
