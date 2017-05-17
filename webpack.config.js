
const path = require('path');
const BabiliPlugin = require("babili-webpack-plugin");

// Workaround for remote server build & deploy problems
// npm skips installing devDependencies{} if NODE_ENV=="production"
// But webpack needs those deps to build! Sure there's a nicer way but #fornow:
const PRODUCTION_STR = "buildproduction";

if (process.env.NODE_ENV == PRODUCTION_STR)
  console.log("*** Building for PRODUCTION ****");
else
  console.log("*** Building for development ****");

module.exports = [
    {
        context: path.join(__dirname, "core"),
        entry: './main.js',
        devtool: "inline-sourcemap",
        output: {
          path: path.join(__dirname, "pub"),
          publicPath: "/",
          filename: "main.build.js"
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015']
                    }
                },
                {
                  test: /\.wasm$/,
                  loader: 'wasm-loader'
                }
            ]
        },
        resolve: {
            extensions: ['', '.js', '.json']
        },
        plugins: process.env.NODE_ENV != PRODUCTION_STR ? [] :
        [
          new BabiliPlugin({removeConsole:true}, {comments: false, sourceMap: false})
        ]
    }
];
