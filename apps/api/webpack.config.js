// webpack.config.js
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin')

module.exports = function (/** @type {{ resolve: { plugins: any; }; }} */ options, /** @type {any} */ _webpack) {
  return {
    ...options,
    resolve: {
      ...options.resolve,
      plugins: [
        ...(options.resolve.plugins || []),
        new TsconfigPathsPlugin({
          configFile: './tsconfig.json',
        }),
      ],
      extensionAlias: {
        '.js': ['.ts', '.js'],
      },
    },
  }
}
