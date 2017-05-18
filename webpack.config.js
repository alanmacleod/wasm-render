
const path = require('path');
const BabiliPlugin = require("babili-webpack-plugin");

// Workaround for remote server build & deploy problems
// npm skips installing devDependencies{} if NODE_ENV=="production"
// But webpack needs those deps to build! Sure there's a nicer way but #fornow:
const PRODUCTION_STR = "buildproduction";

const ENV_STR = (process.env.NODE_ENV == PRODUCTION_STR) ?
  "\x1b[97m\x1b[41m PRODUCTION \x1b[0m" : "\x1b[97m\x1b[44m DEVELOPMENT \x1b[0m";

console.log(`\n\x1b[97m 💅  Building\x1b[0m [${ENV_STR}]\n`);

module.exports = [
    {
        context: path.join(__dirname, "core"),
        entry: './main.ts',
        // devtool: "inline-sourcemap",
        devtool: "source-map",
        output: {
          path: path.join(__dirname, "pub"),
          publicPath: "/",
          filename: "main.build.js"
        },
        module: {
          rules: [ //see: https://webpack.js.org/guides/migrating/
              {
                  test: /\.tsx?$/,
                  loader: 'ts-loader'
              },
              {
                  test: /\.js$/,
                  exclude: /(node_modules)/,
                  use: [
                    {
                      loader: 'babel-loader',
                      // options: { presets: ['es2015'] } // <-- produces deprecation warning... necessary?
                    }
                ]
              },
              {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
              }
          ]
            // loaders: [
            //     {
            //         test: /\.js$/,
            //         exclude: /(node_modules)/,
            //         loader: 'babel-loader',
            //         query: {
            //             presets: ['es2015']
            //         }
            //     }
            // ]
        },
        resolve: {
            extensions: ['.ts','.js', '.json']
        },
        plugins: process.env.NODE_ENV != PRODUCTION_STR ? [] :
        [
          new BabiliPlugin({removeConsole:true}, {comments: false, sourceMap: false})
        ]
    }
];
