const Path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  entry: {
    app: Path.resolve(__dirname, '../src/js/index.js'),
  },
  output: {
    path: Path.join(__dirname, '../public'),
    filename: 'js/[name].js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CompressionPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: Path.resolve(__dirname, '../assets'),
          to: 'assets',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        },
      },
    ],
  },
};
