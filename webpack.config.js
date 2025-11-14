const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',
  devtool: argv.mode === 'production' ? false : 'inline-source-map',
  
  entry: {}, // No entry, we're only processing HTML

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        type: 'asset/inline',
        parser: {
          dataUrlCondition: {
            maxSize: 100 * 1024 // Inline images up to 100kb as base64
          }
        }
      },
      {
        test: /\.svg$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/icons/[name][ext]'
        }
      },
    ],
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: false, // Don't clean, so we don't delete code.js
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/ui.html',
      filename: 'ui.html',
      chunks: [],
      inlineSource: '.(js|css)$',
    }),
    new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets',
          to: 'assets',
        },
      ],
    }),
  ],
});