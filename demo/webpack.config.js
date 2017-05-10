const path = require('path');

module.exports = {
	entry: './demo/src/app.tsx',
	output: {
		filename: 'bundle.js',
		path: path.join(__dirname, 'dist')
	},

	watch: true,

	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		overlay: {
			warnings: true,
			errors: true
		},
		port: 9000
	},

	devtool: 'source-map',

	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.json']
	},

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'awesome-typescript-loader'
			},
			{
				enforce: 'pre',
				test: /\.js$/,
				loader: 'source-map-loader'
			},
			{
				test: /\.html$/,
				use: [ {
					loader: 'html-loader',
					options: {
						minimize: true,
						removeComments: false,
						collapseWhitespace: false
					}
				}]
			}
		]
	}
};