
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const PRODUCTION = false;//process.env.NODE_ENV === 'production';
const envType = PRODUCTION ? 'production' : 'development';

module.exports = {
	mode: envType,
	devtool: 'inline-source-map',
	entry: './src/main.js',
	context: __dirname,
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx']
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				parallel: true,
				terserOptions: {
					// ecma: 6
				}
			})
		]
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env', '@babel/preset-react'],
					plugins: ['@babel/plugin-proposal-class-properties'],
				}
			},
		]
	},

	devServer: {
		host: '0.0.0.0',
		compress: true,
		port: 9000,
		disableHostCheck: true,
		overlay: true
	}
};