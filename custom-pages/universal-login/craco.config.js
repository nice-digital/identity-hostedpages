// CRACO config to override CRA 4 / Webpack 4 behaviour.
//
// A transitive dependency (@mantine/hooks, pulled in by @nice-digital/global-nav)
// ships .mjs ESM files that use named imports from React (a CommonJS module).
// Webpack 4 treats .mjs as strict ESM and rejects those named imports with:
//   Can't import the named export 'useCallback' from non EcmaScript module
//   (only default export is available)
// which breaks the production build.
//
// Handling .mjs files as "javascript/auto" tells Webpack 4 to resolve them the
// same way it does .js (CommonJS-interop) files instead of as strict ESM, so
// the named imports resolve and the build succeeds without changing any
// application behaviour.
//
// Note: resolve.fullySpecified is a Webpack 5 option and is rejected by
// Webpack 4's config schema, so it is intentionally not used here.
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      });
      return webpackConfig;
    },
  },
};
