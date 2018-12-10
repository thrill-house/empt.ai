var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OnlyIfChangedPlugin = require("only-if-changed-webpack-plugin");
var docsLoader = require.resolve("./custom-loaders/docs-loader.js");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    publicPath: "/dist/",
    filename: "build.js"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
            scss: ["vue-style-loader", "css-loader", "sass-loader"],
            sass: [
              "vue-style-loader",
              "css-loader",
              "sass-loader?indentedSyntax"
            ],
            docs: [docsLoader]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          "vue-style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          "postcss-loader"
        ]
      },
      {
        test: /\.scss$/,
        use: ["vue-style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.sass$/,
        use: ["vue-style-loader", "css-loader", "sass-loader?indentedSyntax"]
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        loader: "svg-sprite-loader"
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]?[hash]"
        }
      }
    ]
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js"
    },
    extensions: ["*", ".js", ".vue", ".json"]
  },
  devServer: {
    historyApiFallback: true,
    overlay: true,
    clientLogLevel: "info",
    watchOptions: {
      ignored: "**/_$*.scss"
    }
  },
  performance: {
    hints: false
  },
  devtool: "#eval-source-map"
};

if (process.env.NODE_ENV === "docs") {
  (module.exports.output = {
    path: path.resolve(__dirname, "./.tmp/docs"),
    filename: "build.js"
  }),
    (module.exports.module.rules = [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
            docs: ExtractTextPlugin.extract({
              use: "raw-loader",
              publicPath: "/"
            })
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]?[hash]"
        }
      }
    ]);

  module.exports.resolve.extensions = [".js", ".vue"];

  module.exports.plugins = (module.exports.plugins || []).concat([
    new ExtractTextPlugin({
      filename: "../../DOCS.md",
      allChunks: true
    })
  ]);
}

if (process.env.NODE_ENV === "production") {
  module.exports.devtool = "#source-map";

  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"production"'
      }
    }),
    new OnlyIfChangedPlugin({
      cacheDirectory: path.resolve(__dirname, "./.tmp/cache"),
      cacheIdentifier: process.env.NODE_ENV
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
}
