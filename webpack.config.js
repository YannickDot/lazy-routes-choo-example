const {resolve, join} = require('path')
const webpack = require('webpack')

module.exports = env => {
  const addPlugin = (add, plugin) => add ? plugin : undefined
  const ifProd = plugin => addPlugin(env.prod, plugin)
  const ifDev = plugin => addPlugin(env.dev, plugin)
  const removeEmpty = array => array.filter(i => !!i)

  console.log(
    removeEmpty([
      ifDev('webpack/hot/dev-server'),
      './js/index.js'
    ])
  )

  return {
    devtool: env.prod ? 'source-map' : 'source-map',
    entry: [
      './src/index.js'
    ],
    output: {
      path: join(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: ''
    },
    module: {
      loaders: [
        { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
        // { test: /\.css$/, loader: "style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!less"}
      ]
    },
    plugins: removeEmpty([
      ifProd(new webpack.optimize.DedupePlugin()),
      ifProd(new webpack.LoaderOptionsPlugin({
         minimize : true,
         debug: false
      })),
      ifProd(new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      })),
      ifProd(new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: false
        }
      })),
      ifDev(new webpack.HotModuleReplacementPlugin()),
      ifDev(new webpack.NoErrorsPlugin())
    ]),
    devServer: {
      port: 8080,
      host: '0.0.0.0',
      contentBase: 'dist',
      hot: true,
      inline: true,
  		historyApiFallback: true
    },
    resolve: {
      extensions: ['.js', '.json', '.styl'],
      modules: [resolve(__dirname, "forked-lib"), "node_modules"]
    }

  }
}
