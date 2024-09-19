import { defineConfig } from 'taze';

export default defineConfig({
  exclude: [],
  force: true,
  write: true,
  install: true,
  packageMode: {
    typescript: 'patch',
  },
  // disable checking for "overrides" package.json field
  depFields: {
    overrides: true,
  },
});
