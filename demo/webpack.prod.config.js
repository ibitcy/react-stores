const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './demo/src/app.tsx',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '../dist/demo'),
  },

  devtool: 'none',
  mode: 'production',

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
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
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
  ],
};
