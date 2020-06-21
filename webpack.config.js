const path = require("path");

module.exports = {
  entry: ["./js/perlin.js", "./js/simulation.js"],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist/"),
  },
  devServer: {
    publicPath: "/dist/",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
