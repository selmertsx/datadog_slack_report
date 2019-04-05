const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: "./src/index.ts",
  target: 'node',
  externals: "@google-cloud/firestore",
  output: {
    path: __dirname,
    filename: 'index.js',
    libraryTarget: 'this'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          { loader: 'ts-loader' },
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [
      '.ts',
      '.tsx',
      '.jsx',
      '.js',
      '.json'
    ],
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ]
  }
}
