const path = require('path');
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpack.DefinePlugin({
      process: JSON.stringify(undefined),
      'DISABLE_DOCX_XLSX': JSON.stringify(true),
    }),
  ]
};
