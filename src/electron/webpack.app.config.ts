import CopyPlugin from "copy-webpack-plugin";
import FriendlyErrorsWebpackPlugin from "friendly-errors-webpack-plugin";
import { resolve } from "path";
import { Configuration, DefinePlugin } from "webpack";
import webpackNodeExternals from "webpack-node-externals";
import pkg from "../../package.json";
import { state as globalState } from "./global-state";
import { Environment } from "./src/models/env.enum";

const env = (process.env.NODE_ENV as Environment) || Environment.Development;
export const config: Configuration = {
  target: "electron-renderer",
  mode: env,
  node: {
    __dirname: false,
    __filename: false
  },
  externals: [webpackNodeExternals()],
  resolve: {
    alias: {
      env: resolve(__dirname, `../config/env_${env}.json`)
    }
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      { test: /\.ts$/, use: "ts-loader" },
      {
        test: /\.ya?ml$/,
        use: { loader: "yaml-import-loader", options: { output: "object" } }
      }
    ]
  },
  plugins: [
    new DefinePlugin({
      "process.env": {
        GLOBAL_STATE: JSON.stringify(globalState),
        NODE_ENV: JSON.stringify(env),
        version: JSON.stringify(pkg.version),
        author: JSON.stringify(pkg.author)
      }
    }),
    new FriendlyErrorsWebpackPlugin({ clearConsole: env === "development" }),
    new CopyPlugin({
      patterns: [
        { from: "./src/index.html" },
        { from: "./src/about.html" },
        { from: "./src/about.js" },
        { from: "./src/icon.png" },
        { from: "../../dist/stylesheets/main.css" },
        { from: "../../dist/antd.css" }
      ],
      options: { concurrency: 10 }
    })
  ]
};
