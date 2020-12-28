const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([
        {
          from: path.join("./src/cloudfunctions"),
          to: path.join("cloudfunctions"),
        },
      ]),
    ],
  },
};
