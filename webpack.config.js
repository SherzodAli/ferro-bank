const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { DefinePlugin } = require('webpack')

require('dotenv').config()

const mode = process.env.NODE_ENV
const isProduction = mode === 'production'

const plugins = [
	new DefinePlugin({ 'process.env': JSON.stringify(process.env) }),
	new CleanWebpackPlugin(),
	new HtmlWebpackPlugin({
		template: 'index.html',
		minify: { collapseWhitespace: isProduction, removeComments: isProduction }
	}),
	new MiniCssExtractPlugin({
		filename: isProduction ? '[name].[contenthash].css' : '[name].css',
		chunkFilename: isProduction ? '[id].[contenthash].css' : '[id].css'
	})
]

module.exports = {
	context: path.resolve(__dirname, 'src'),
	mode,
	entry: './index.js',
	output: {
		filename: isProduction ? '[name].[contenthash].js' : '[name].js',
		path: path.resolve(__dirname, 'dist'),
		assetModuleFilename: 'public/[name].[contenthash][ext][query]'
	},
	resolve: {
		extensions: ['.js'],
		alias: { '@': path.resolve(__dirname, 'src/') }
	},
	devtool: isProduction ? false : 'source-map',
	devServer: {
		port: 7777,
		hot: true,
		static: { directory: path.resolve(__dirname, 'public') },
		historyApiFallback: true
	},
	optimization: {
		minimize: isProduction,
		minimizer: [
			new CssMinimizerPlugin(),
			new TerserPlugin({
				parallel: true,
				terserOptions: { format: { comments: false } }
			})
		]
	},
	plugins,
	module: {
		rules: [
			{ test: /\.html$/i, loader: 'html-loader' },
			{
				test: /\.js$/i,
				exclude: /node-modules/,
				use: {
					loader: 'babel-loader',
					options: { presets: ['@babel/preset-env'] }
				}
			},
			{
				test: /\.module\.s[ac]ss$/i,
				use: [
					isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
					{
						loader: 'css-loader',
						options: { modules: { localIdentName: '[local]_[hash:base64:7]' } }
					},
					{ loader: 'sass-loader', options: { sourceMap: true } }
				]
			},
			{
				test: /^((?!\.module).)*s[ac]ss$/i,
				use: [
					isProduction ? 'style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
					{ loader: 'sass-loader', options: { sourceMap: true } }
				]
			},
			{
				test: /\.css$/i,
				use: [
					'style-loader',
					'css-loader',
					{ loader: 'postcss-loader', options: { sourceMap: true } }
				]
			},
			{ test: /\.(png|svg|jpg|jpeg|gif)$/i, type: 'asset/resource' },
			{
				test: /\.m?js$/i,
				exclude: /node-modules/,
				use: {
					loader: 'babel-loader',
					options: { presets: ['@babel/preset-env'] }
				}
			}
		]
	}
}
