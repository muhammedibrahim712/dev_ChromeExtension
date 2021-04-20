// import webpack from 'webpack'
import path from 'path'
import CopyPlugin from 'copy-webpack-plugin'
const srcDir = path.join(__dirname, '..')

export default {
  // devtool: 'inline-source-map',
  mode: 'development',
  entry: {
    popup: path.join(srcDir, 'popup.js'),
    options: path.join(srcDir, 'options.js'),
    background: path.join(srcDir, 'background.js'),
    content_script: path.join(srcDir, 'content_script.js'),
  },
  output: {
    path: path.join(__dirname, '../../dist/js'),
    filename: '[name].js',
  },
  // module: {
  //   rules: [
  //     {
  //       exclude: /node_modules/,
  //       test: /\.tsx?$/,
  //       use: 'ts-loader',
  //     },
  //   ],
  // },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial',
    },
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: '.', to: '..', context: 'public' }],
      options: {},
    }),
  ],
}
