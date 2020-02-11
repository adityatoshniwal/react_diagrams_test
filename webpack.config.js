
const PRODUCTION = process.env.NODE_ENV === 'production';
const envType = PRODUCTION ? 'production': 'development';

module.exports = {
  mode: envType,
  entry: {
    index: "./js/index.js",
  },
  output: {
    path: __dirname + "/dist",
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
        // {
        //     test: require.resolve('snapsvg'),
        //     use: {
        //     loader: 'imports-loader?this=>window,fix=>module.exports=0',
        //     },
        // }
    ],
  },
  plugins: [],
  resolve: {
    modules: ['node_modules', '.'],
  }
};