const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
    app: path.resolve(__dirname, 'index.js')
  },
  output: {
    path: path.resolve(__dirname, 'compiled'),
    filename: 'components.js',
    library: 'volta',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    // webpack5 defaults this to "self", which only exists in browsers;
    // "this" keeps the UMD bundle loadable from Node (require) too.
    globalObject: 'this'
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    },
    'react-router-dom': {
      commonjs2: 'react-router-dom',
      commonjs: 'react-router-dom',
      amd: 'react-router-dom'
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  modules: false,
                },
              ],
              '@babel/preset-react',
              '@babel/preset-flow',
            ],
          }
        }
      }, {
        // Components are self-contained: their CSS is injected on import,
        // so this bundle works as a single <script> drop-in with no
        // separate stylesheet to remember to link.
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    // A handful of legacy components reference React/PropTypes without
    // importing them (pre-dating this build). Providing them here means
    // the bundle works standalone, without requiring every call site to
    // be tracked down and fixed individually.
    new webpack.ProvidePlugin({
      React: 'react',
      PropTypes: 'prop-types'
    })
  ],
  resolve: {
    extensions: ['.jsx', '.js']
  }
};
