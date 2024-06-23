const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const { TimekeeperWebpackPlugin } = require('timekeeper-plugin/dist');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const deps = require('./package.json').dependencies;

const current = new Date(Date.now());
const year = current.getFullYear().toString();
const month = (current.getMonth() + 1).toString().padStart(2, '0');
const day = current.getDate().toString().padStart(2, '0');
const hours = current.getHours().toString().padStart(2, '0');
const minutes = current.getMinutes().toString().padStart(2, '0');

const moduleVersion = `${year}_${month}_${day}__${hours}_${minutes}`;

module.exports = async (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
      new ModuleFederationPlugin({
        name: 'exampleWebpack',
        library: { type: 'var', name: 'exampleWebpack' },
        filename: `${moduleVersion}.remoteEntry.js`,
        exposes: {
            './Footer': './src/components/Footer.tsx'
        },
        // remotes: {
        //   exampleVite: await TimekeeperWebpackPlugin.getRemoteEntry({
        //     remoteName: "exampleVite",
        //     version: "latest",
        //     apiUrl: "http://localhost:8080",
        //     baseUrl: "http://localhost:7777/file/",
        //     fallbackUrl: "http://localhost:7777/file/2024_06_19__13_47.remoteEntry.js",
        //     timeout: 5000
        //   }),
        // },
        shared: {
            ...deps,
            react: { eager: true },
            'react-dom': { eager: true },
            'react-router-dom': { eager: true },
        },
      }),
      new TimekeeperWebpackPlugin({
        remoteName: "exampleWebpack",
        version: moduleVersion,
        apiUrl: "http://localhost:8080",
        baseUrl: "http://localhost:7777/file/",
        environment: isProduction ? "production" : "development"
      })
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      hot: true,
      port: 5002,
    },
  }
};