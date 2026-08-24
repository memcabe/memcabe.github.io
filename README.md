# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

---

## Prerequisites

Before working with this site, make sure you have the following installed:

- **Node.js** (version 18 or newer)  
  Check with:
  ```bash
  node -v
```

* **Yarn** (package manager)
  Install globally if needed:

  ```bash
  npm install -g yarn
  ```

---

## Installation

Install all project dependencies:

```bash
yarn install
```

This command reads the `package.json` file and installs everything needed to build and run the site locally.

---

## Local Development

Start the development server:

```bash
yarn start
```

This will:

* Launch a local server (default: [http://localhost:3000](http://localhost:3000))
* Automatically open the site in your browser
* Enable **live reload**, so changes appear instantly

---

## Editing the Site

* Documentation lives in the `docs/` directory
* Edit or add `.md` (Markdown) files
* Save changes

The browser will automatically refresh to reflect updates, no restart required.

---

## Stopping the Server

When you're done editing, stop the development server:

```bash
Ctrl + C
```

---

## Build

To generate a new version of the site:

```bash
yarn build
```

This creates a static site in the `build/` directory, which can be deployed to github pages.

---

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub Pages for hosting, this command builds the website and pushes it to the `gh-pages` branch.

---

## Typical Workflow

```bash
git clone <repo>
cd Olympus_Docs
yarn install
yarn start   # develop locally
```

After making changes:

```bash
Ctrl + C
git add .
git commit -m "Update documentation"
git push
```

---

## Adding a page
make a new *.md file in docs
```touch docs/example.md```
add content (top of file must include an id and a title)
```
---
id: example
title: Example Page
---
```
add new page to the sidebar ```vim sidebars.ts```
```
const sidebars = {
  tutorialSidebar: [
    'intro',
    'example', // ADD THIS LINE
  ],
};

export default sidebars;
```
Now you can do a ```yarn start``` to view your changes in browser
---
## Notes
.gitignore was automatically generated with Docusaurus. Using `git add .` should work with all new changes. If you would like to be extra sure that the build is clean, follow the directions below.
* Do **not** commit `node_modules/` or `build/`
* Always use `yarn install` after pulling new changes
* Use `yarn build` only when preparing for deployment
