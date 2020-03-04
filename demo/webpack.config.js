const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const packageInfo = require('../package.json');

module.exports = {
  mode: 'development',

  entry: './demo/src/app.tsx',

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
  },

  watch: true,

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    overlay: {
      warnings: true,
      errors: true,
    },
    port: 9000,
  },

  devtool: 'inline-source-map',

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
              removeComments: false,
              collapseWhitespace: false,
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new CopyWebpackPlugin(
      [
        {
          from: path.join(__dirname, 'src/index.html'),
          to: 'index.html',
        },
      ],
      {
        debug: false,
        copyUnmodified: false,
      },
    ),
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(packageInfo.version),
      __IS_DEV__: JSON.stringify(true),
    }),
  ],
};
