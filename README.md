# QA Dojo — Playwright Tests

Small Playwright test suite for the QA Dojo exercises.

## Contents

- `tests/` — main Playwright test specs (e.g. `products-crud.spec.ts`).
- `fakeapi-platzi/` — additional test specs for the fake API.
- `obj/` — helper objects and test data used by specs.
- `data/` — supplemental test data and notes.
- `playwright-report/` — generated HTML report output from Playwright.
- `test-results/` — stored results and error contexts from previous runs.

## Prerequisites

- Node.js 18+ (or a recent Node LTS)
- npm (bundled with Node)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browsers (required before running tests):

```bash
npx playwright install --with-deps
```

Note: `--with-deps` installs the system dependencies needed for browsers on Linux. If you cannot use it, run `npx playwright install`.

## Run tests

- Run the full test suite:

```bash
npx playwright test
```

- Run a single test file (example):

```bash
npx playwright test tests/products-crud.spec.ts
```

- Run tests headed (with browser UI):

```bash
npx playwright test --headed
```

- Generate and open the HTML report after a run:

```bash
npx playwright show-report
# or open the generated file
# open playwright-report/index.html
```

If your project adds npm scripts, you can also add convenient shortcuts to `package.json` such as:

```json
"scripts": {
  "test": "playwright test",
  "test:report": "playwright show-report"
}
```

## Project notes

- There are example test runs and reports already under `playwright-report/` and `test-results/`.
- If a test needs external services (a fake API), ensure those are available before running the suite.

## Contributing

- Follow existing test patterns in `tests/` and `fakeapi-platzi/`.
- Add new helper utilities to `obj/` and reference them from specs.

## License

This repository has no license specified. Add a `LICENSE` file if you wish to make terms explicit.

---

If you want, I can add `npm` scripts to `package.json` and a brief contributor guide. Reply if you'd like that.
