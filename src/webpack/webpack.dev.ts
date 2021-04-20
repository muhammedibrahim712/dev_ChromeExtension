import { merge } from 'webpack-merge'
import common from './webpack.common'

module.exports = merge(common, {
  ...common,
  mode: 'development',
  //   devtool: 'inline-source-map',
})
