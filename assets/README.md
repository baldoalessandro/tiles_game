# Assets source folder

This folder contain the source for all the resources used in the app.

## PWA assets generation

All the required icons for PWA installation are generate from
`assets/logo/logo.svg` whit `yarn generate-pwa-assets` using the CLI from
`@vite-pwa/assets-generator.

The genereted assets should be moved to the `public/` folder.

## SVG favicon generation

Run `yarn generate-svg-favicon` to optimize `assets/logo/logo.svg` for usage
as a scalable favicon.

The genereted asset will be placed automatically in the `public/` folder.
