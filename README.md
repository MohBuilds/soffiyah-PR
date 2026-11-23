# Sophiat Ismail — Portfolio

A Notion-inspired portfolio for a content strategist and writer specializing in health, wellness, and lifestyle content.

## Run locally

Requires Node.js. No dependencies to install.

```sh
npm run dev
```

Open http://127.0.0.1:4173.

```sh
npm run check
```

## Project structure

- `dist/index.html`: portfolio content and article links
- `dist/style.css`: responsive layout and light/dark themes
- `dist/app.js`: sample filters, navigation, and saved theme preference
- `server.cjs`: local static preview server
- `.openai/hosting.json`: private Sites hosting configuration

The `dist` folder is ready to deploy as a static website. Fonts are served by Google Fonts, with local font fallbacks. Article links open their original publications or Google Docs. Contact links open the visitor's mail app.

## Deploy to Netlify

Connect this GitHub repository and deploy the `main` branch. The root `netlify.toml` configures:

| Setting | Value |
| --- | --- |
| Base directory | Repository root (`.`) |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node.js | 22 |

No framework, environment variables, functions, or running Node server are required. `npm run build` validates the existing static files and their local asset links; it does not generate another output directory. Keep `dist` tracked in Git.

For an existing Netlify project, make sure its repository is `MohBuilds/soffiyah-PR`, its production branch is `main`, and any package directory is blank. Redeploy the latest commit after this configuration is pushed. Do not use `npm start` as the build command.

For manual drag-and-drop deployment, upload the **dist folder**, or a ZIP containing `index.html`, `style.css`, and `app.js` directly at its root. Uploading the repository root would put the homepage in the wrong location.
