const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              // Esto ayuda a silenciar warnings de dependencias Sass
              sassOptions: {
                quietDeps: true
              }
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/[name][ext]"
        }
      },
      {
        test: /\.ya?ml$/i,
        use: "yaml-loader"
      },
      {
        test: /\.csv$/i,
        use: "csv-loader"
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "public", to: "." }]
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
  ],
  devServer: {
    static: path.resolve(__dirname, "public"),
    hot: true,
    port: 8080
  },

  ignoreWarnings: [
    (warning) =>
      typeof warning.message === "string" &&
      warning.message.includes("The legacy JS API is deprecated")
  ],

  mode: "development"
};
