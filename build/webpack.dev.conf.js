'use strict'
const utils                = require('./utils')
const webpack              = require('webpack')
const config               = require('../config')
const merge                = require('webpack-merge')
const path                 = require('path')
const baseWebpackConfig    = require('./webpack.base.conf')
const CopyWebpackPlugin    = require('copy-webpack-plugin')
const HtmlWebpackPlugin    = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const VueLoaderPlugin      = require('vue-loader/lib/plugin')
const portfinder           = require('portfinder')
// 加的
const postcssPresetEnv     = require('postcss-preset-env')
const proMode              = process.env.NODE_ENV === 'production'
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  node   : {
    fs: "empty",
    dns: 'empty',
  },
  module : {
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader'
      },
      {
        test: /(katex|github\-markdown|prism[\-a-z]*|\.theme)\.css$/,
        use : [
          'to-string-loader',
          'css-loader',
        ],
      },
      {
        test   : /\.css$/,
        exclude: /(katex|github\-markdown|prism[\-a-z]*|\.theme)\.css$/,
        use    : [
          proMode ? MiniCssExtractPlugin.loader : 'style-loader',
          {loader: 'css-loader', options: {importLoaders: 1}},
          {
            loader: 'postcss-loader', options: {
              ident  : 'postcss',
              plugins: () => [
                postcssPresetEnv({
                  stage: 0,
                }),
              ],
            },
          },
        ],
      },
    ],
    // utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel    : 'warning',
    historyApiFallback: {
      rewrites: [
        {from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html')},
      ],
    },
    hot               : true,
    contentBase       : false, // since we use CopyWebpackPlugin.
    compress          : true,
    host              : HOST || config.dev.host,
    port              : PORT || config.dev.port,
    open              : config.dev.autoOpenBrowser,
    overlay           : config.dev.errorOverlay
      ? {warnings: false, errors: true}
      : false,
    publicPath        : config.dev.assetsPublicPath,
    proxy             : config.dev.proxyTable,
    quiet             : true, // necessary for FriendlyErrorsPlugin
    watchOptions      : {
      poll: config.dev.poll,
    },
  },
  plugins  : [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename   : 'index.html',
      template   : path.resolve(__dirname, '../src/index.ejs'),
      minify     : {
        collapseWhitespace   : true,
        removeAttributeQuotes: true,
        removeComments       : true,
      },
      nodeModules: process.env.NODE_ENV !== 'production'
        ? path.resolve(__dirname, '../node_modules')
        : false,
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from  : path.resolve(__dirname, '../static'),
        to    : config.dev.assetsSubDirectory,
        ignore: ['.*'],
      },
    ]),
    new VueLoaderPlugin(),
  ],
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    }
    else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT                = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors              : config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined,
      }))

      resolve(devWebpackConfig)
    }
  })
})
