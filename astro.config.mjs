import { defineConfig } from 'astro/config';

// For a GitHub Pages user site (username.github.io), keep base as '/'.
// If you publish from a normal project repository instead, set base to '/repository-name/'.
export default defineConfig({
  site: 'https://Shivraj222.github.io',
  base: '/',
  trailingSlash: 'always',
});
