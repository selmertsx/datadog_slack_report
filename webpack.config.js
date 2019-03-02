const path = require('path');

module.exports = {
  entry: "./src/index.ts",
  target: 'node',
  devtool: 'source-map',
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
          { loader: 'babel-loader' },
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
