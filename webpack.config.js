const path = require("path");
console.log(path.resolve(__dirname, "dist"));

module.exports = {
  entry: ["./js/perlin.js", "./js/simulation.js"],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist/"),
  },
  devServer: {
    publicPath: "/dist/", //<- this defines URL component #2 above
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
