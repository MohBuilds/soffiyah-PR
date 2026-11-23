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
