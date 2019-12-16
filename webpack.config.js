const path = require('path');
const webpack = require("webpack");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist/'),
  },
  optimization: {
    // 壓縮 CSS 與 JS
    minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin()],
  },

  plugins: [
    // 清除 dist 目錄
    new CleanWebpackPlugin(),

    // 抽離 CSS
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
    }),

    // 新增 ProvidePlugin 的設定，讓 JS 模組可以使用 jQuery
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'root.jQuery': 'jquery',
        Popper: ['popper.js', 'default']
    }),
  ],
  module: {
    rules: [

      // 設定 Babel
      {
        test: /\.(js)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },

      // 打包圖片
      {
        test: /\.(png|jpg|gif|jpe?g|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000, //bytes
              name: '[name].[ext]',
              publicPath: '../images/',
              emitFile: false
            }
          }
        ]
      },

      // 編譯 Sass > PostCSS(autoprefix) > 讀取 CSS > 抽離 CSS
      {
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: "postcss-loader",
            options: {
              ident: 'postcss',
              plugins: [
                require('postcss-flexbugs-fixes'),
                require('autoprefixer')({
                  'browsers': ['> 1%', 'last 2 versions']
                }),
              ]
            }
          },
          'sass-loader'],
      },
      
      // 新增 expose 的設定，將 jQuery 加入全域
      {
        test: require.resolve('jquery'),
        use: [{
        loader: 'expose-loader',
        options: 'jQuery'
        },{
        loader: 'expose-loader',
        options: '$'
        }]
      }
    ]
  }
};