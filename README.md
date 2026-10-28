# Shivraj Deshmukh — personal research & creative website

A first working version of a research-first personal website built with Astro. It is a static website: it needs no database, server, paid theme, or runtime account. PDFs are linked externally; this project does not embed PDF viewers or require you to store every document in the repository.

> **Before announcing the site:** the page structure is real, but some cards are sample copy. Replace the sample archive entries, channel titles/descriptions/links, and artwork placeholders with your own. Do not leave example records online if they could be mistaken for real publications or finished work.

## What is included

- Home page with research-first identity and links to the main sections.
- Research archive with search, material-type filter, work-status filter, and category links.
- Research categories for projects, publications, preprints/manuscripts, technical notes, academic writings, presentations, and reading/reference material.
- Public-facing status language for exploratory, ongoing, completed, in-preparation, and discontinued work.
- Writings & ideas, media/channels, art/photography, and about pages.
- Responsive navigation, small motion effects, reduced-motion support, and phone/tablet layouts.
- GitHub Actions workflow to deploy to GitHub Pages.

## 1. Run it on your computer

### Install the prerequisites

1. Install **Node.js 24 LTS** from [nodejs.org](https://nodejs.org/) (or Node.js 22.23.4 or newer). Node includes `npm`; current Astro releases require a sufficiently recent even-numbered Node version.
2. Download and unzip this project.
3. Open the unzipped `fieldnotes-site` folder in a terminal. On Windows, you can open the folder in VS Code, then choose **Terminal → New Terminal**.

### Start the local preview

Run these commands inside the project folder:

```bash
npm install
npm run dev
```

The terminal will show a local address, usually `http://localhost:4321/`. Open that address in your browser. Keep the terminal open while previewing. Stop the server with `Ctrl+C`.

To check the production build later:

```bash
npm run build
npm run preview
```

Astro produces the static website in the `dist/` folder.

## 2. The easiest files to edit

You can change the sample content without redesigning the pages:

- `src/data/siteContent.ts` — research entries, writing section descriptions, channel profiles, and art categories. This is the main content file.
- `src/pages/index.astro` — homepage wording and featured sections.
- `src/styles/global.css` — colours, fonts, spacing, layout, and responsive behaviour.
- `astro.config.mjs` — the website URL and GitHub Pages path setting.

### Add a research entry

Open `src/data/siteContent.ts` and add a new object to `researchEntries`. Copy an existing object and replace its values. Typical fields are:

- `id`: a unique short identifier, such as `boundary-charge-note-2026`.
- `type`: one of `project`, `publication`, `preprint`, `note`, `writing`, `presentation`, or `reading`.
- `title`, `description`, `status`, and `maturity`.
- `topics`: an array of searchable tags.
- `related`: a short note connecting it to other work.
- `pdfUrl`: a real external PDF URL, or an empty string until you have one.
- `externalUrl`: an optional source page, DOI, arXiv record, or project link.
- `sample`: use `false` or remove this field for your real entry. Keep it `true` for illustrative examples.

For a real PDF link, paste the full URL into `pdfUrl`. The research card automatically shows an **Open / download PDF** link when that field is present. Do not invent links; leave the field empty until you have a working destination.

Use the following labels carefully:

- **Work status** says where the work stands: Published, Preprint, Submitted, In preparation, Ongoing, Exploratory, Completed, or Discontinued.
- **Maturity** describes the state of a technical document: Working notes, Developing draft, Polished note, etc.

They are different concepts. A polished technical note can still be exploratory; a project can be completed without becoming a publication.

### Add or change a channel

Edit the `channelCards` array in `src/data/siteContent.ts`. Change `title`, `description`, `content`, and `purpose`, then paste the real public account URL into `url`. Four YouTube cards and one Instagram card are already provided as starting templates.

### Add photographs or paintings

The art page currently uses abstract CSS placeholders. Replace these with image files you own or have permission to publish. For a simple first pass, put images in `public/images/` and use paths like `/images/my-photo.jpg` in an `<img>` element. Add titles and short captions to `src/data/siteContent.ts` or the page component as the art layout evolves.

## 3. Publish it for free with GitHub Pages

GitHub Pages can host this static site at a free `github.io` URL. The included workflow deploys the site whenever you push to the `main` branch.

### Recommended setup: a user-site repository

This is the simplest route because the website lives at the root of the domain and the configuration already uses `base: '/'`.

1. Create or sign in to a GitHub account.
2. Create a **public** repository named exactly `YOUR-USERNAME.github.io` (replace `YOUR-USERNAME` with your GitHub username).
3. Open `astro.config.mjs`. Replace `https://YOUR-GITHUB-USERNAME.github.io` in the `site` field with your actual GitHub Pages URL. Keep `base: '/'`.
4. In the project folder, run `npm install` once so a `package-lock.json` is generated, then upload the project contents to the repository. Make sure the `.github/workflows/deploy.yml` file and the generated lockfile are included.
5. In GitHub, open **Settings → Pages** and choose **GitHub Actions** as the build/deployment source.
6. Open the repository’s **Actions** tab. Wait for the first “Deploy website to GitHub Pages” run to finish successfully.
7. Visit `https://YOUR-USERNAME.github.io`.

After that, edit locally, test with `npm run dev`, then push your changes to `main`. GitHub Actions will rebuild and republish the website automatically.

### If you use a repository with a different name

For a repository called `personal-site`, the public address is usually `https://YOUR-USERNAME.github.io/personal-site/`. In `astro.config.mjs`, change `base` to `'/personal-site/'` and set `site` to `https://YOUR-USERNAME.github.io`. Internal links use Astro’s `BASE_URL`, so the navigation and page links follow the configured base path.

### Important public-site note

Everything pushed to a public repository and deployed here is public — including files and PDFs stored in the repository. Since you prefer external document hosting, the research records can link to public files hosted elsewhere. Never add private correspondence, confidential collaboration material, credentials, or files you do not have permission to publish.

## Design and content principles

- Research remains the first and most detailed part of the site.
- Document types are separated; PDFs are a format, not a category.
- Entries can cross-link rather than duplicate the same document in multiple lists.
- Every unfinished item should have a clear status and any important limitations.
- External document links are shown as links; there is no embedded PDF viewer.
- The initial content model is intentionally simple. A browser-based editor can be added later if editing these files becomes inconvenient.

## Official references

- [Astro getting started](https://docs.astro.build/en/getting-started/)
- [Astro deployment to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)


## Homepage portrait and physics illustrations

The homepage portrait is stored at `public/images/shivraj-portrait.jpg`. Replace that file if you want to use a different portrait, keeping the same filename or updating the image path in `src/pages/index.astro`. The black hole, curved spacetime, and equation illustrations are lightweight CSS and SVG artwork built into the homepage, so they do not need separate image files. The Pale Blue Dot image is served from NASA's official image asset and is credited on the homepage.
