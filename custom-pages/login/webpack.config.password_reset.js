const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const args = process.argv.slice(2)
const PRODUCTION = (args[0] === '--release')
const DEBUG = !(args[0] === '--release')
const VERBOSE = args[0] === '--verbose'

/**
 * Webpack configuration (core/password_reset.js => build/bundle.js)
 * http://webpack.github.io/docs/configuration.html
 */
const config = {
  // The base directory
  context: path.resolve(__dirname, './src'),

  // The entry point for the bundle
  entry: {
    app: ['./password_reset.js'],
    vendor: [
      'auth0-js',
      'es5-shim',
      'babel-polyfill',
      'es6-promise',
      'fetch-detector',
      'fetch-ie8',
      'fetch-jsonp',
      'react',
      'react-dom',
      'react-router'
    ]
  },

  // Options affecting the output of the compilation
  output: {
    path: path.resolve(__dirname, './build/assets'),
    publicPath: PRODUCTION ? '#{HOSTED_PAGES_ASSETS_CDN_URI}' : '/',
    filename: '[name].password_reset.js',
    chunkFilename: '[name].password_reset.js',
    sourcePrefix: '  '
  },

  // Switch loaders to debug or release mode
  debug: DEBUG,
  cache: DEBUG,

  // Developer tool to enhance debugging, source maps
  // http://webpack.github.io/docs/configuration.html#devtool
  // devtool: DEBUG ? 'source-map' : false,
  devtool: 'source-map',

  // What information should be printed to the console
  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
    children: false
  },

  // The list of plugins for Webpack compiler
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
      __DEV__: DEBUG,
      __BASENAME__: JSON.stringify(process.env.BASENAME || '')
    }),
    new ExtractTextPlugin('styles.password_reset.css', {
      minimize: !DEBUG,
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/password_reset.ejs'),
      filename: 'password_reset.html',
      minify: !DEBUG
        ? {
          collapseWhitespace: true
        }
        : null,
      hash: true
    }),
  ],

  // Options affecting the normal modules
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, './src')],
        loader: 'babel-loader',
        query: {
          plugins: []
        }
      },
      {
        test: /\.css/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader?-autoprefixer&modules=true&localIdentName=[local]!postcss-loader'
        )
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader?-autoprefixer!postcss-loader!sass-loader'
        )
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader',
        query: {
          name: 'assets/[path][name].[ext]',
          limit: 10000
        }
      },
      {
        test: /\.(eot|ttf|wav|mp3|ogg)$/,
        loader: 'file-loader',
        query: {
          name: 'assets/[path][name].[ext]'
        }
      }
    ]
  },

  // Alias
  resolve: {
    alias: {
      components: path.resolve(__dirname, './src/components/'),
      routes: path.resolve(__dirname, './src/routes/'),
      services: path.resolve(__dirname, './src/services/'),
      containers: path.resolve(__dirname, './src/containers/')
    }
  }
}

// Optimize the bundle in release (production) mode
if (!DEBUG) {
  config.plugins.push(new webpack.optimize.DedupePlugin())
}

// https://github.com/jun0205/react-static-boilerplate/issues/14
// Must always Uglify somehow or it won't work in IE8
const uglyOptions = !DEBUG
  ? {
    compress: {
      warnings: VERBOSE,
      screw_ie8: false,
    },
    mangle: { screw_ie8: false },
    output: { screw_ie8: false }
  }
  : {
    mangle: false,
    compress: {
      drop_debugger: false,
      warnings: VERBOSE,
      screw_ie8: false
    },
    output: {
      beautify: true,
      comments: true,
      bracketize: true,
      indent_level: 2,
      keep_quoted_props: true,
      screw_ie8: false
    },
  }

config.plugins.push(new webpack.optimize.UglifyJsPlugin(uglyOptions))

if (!DEBUG) {
  config.plugins.push(new webpack.optimize.AggressiveMergingPlugin())
  config.module.loaders
    .find(x => x.loader === 'babel-loader')
    .query.plugins.unshift(
      'transform-react-remove-prop-types',
      'transform-react-constant-elements',
      'transform-react-inline-elements',
      'transform-es3-modules-literals',
      'transform-es3-member-expression-literals',
      'transform-es3-property-literals'
    )
}

module.exports = config
