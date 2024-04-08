/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
// in case you run into any typescript error when configuring `devServer`
import 'webpack-dev-server';

const config: webpack.Configuration = {
  mode: 'production',

  devtool: 'inline-source-map',
  entry: path.resolve(__dirname, 'src', 'main.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.[fullhash].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-react',
                {
                  runtime: 'automatic',
                  importSource: '@rexar/core', // defaults to react (only in automatic runtime)
                },
              ],
              ['@babel/preset-typescript'],
            ],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Custom template',
      // Load a custom template (lodash by default)
      template: 'index.html',
    }),
  ],
  optimization: {
    splitChunks: {
      maxSize: 1048576,
    },
  },
  performance: {
    maxEntrypointSize: 1048576,
    maxAssetSize: 1048576,
  },
};

export default config;

