
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PRODUCTION = process.env.NODE_ENV === 'production';
const envType = PRODUCTION ? 'production': 'development';

module.exports = {
  mode: envType,
  entry: {
    app: "./js/index.js",
    main: "./css/bundle.css",
  },
  output: {
    path: __dirname + "/dist",
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        loader: 'babel-loader',

        options: {
          presets: ['@babel/preset-env','@babel/preset-react']
        }
      },{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
				],
			}
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `app.style.css`
    }),    
  ],
  resolve: {
    modules: ['node_modules', '.'],
  }
};