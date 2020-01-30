const TerserPlugin = require('terser-webpack-plugin');
const babelPolyill = require('@babel/polyfill');

module.exports = { 
    entry: {
        "primeClean":"./src/primeClean.js",
        "background":"./src/background.js",
    },
    output: {
        path: __dirname,
        filename: "amazon without prime/[name].js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [["@babel/preset-env",
                        {
                          "targets": {
                            "chrome": "49"
                          }
                        }], babelPolyill],
                        plugins: ['@babel/plugin-proposal-object-rest-spread']
                    }
                }
            }
        ]
    },
    optimization: {
        minimizer: [
          new TerserPlugin({
            cache: true,
            parallel: true,
          }),
        ],
      }
};