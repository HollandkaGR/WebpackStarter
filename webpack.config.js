var webpack = require('webpack')
var path = require('path')
var glob = require('glob');
let ExtractTextPlugin = require('extract-text-webpack-plugin')
let PurifyCSSPlugin = require('purifycss-webpack');
let CleanWebpackPlugin = require('clean-webpack-plugin');
var inProduction = (process.env.NODE_ENV === 'production')

module.exports = {
	entry: {
		app: [
			'./src/main.js',
			'./src/style.sass'
		],
		vendor: ['jquery']
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: '[name].js'
	},
	module: {
		rules: [
		{
			test: /\.s[ac]ss$/,
			use: ExtractTextPlugin.extract({
				fallback: "style-loader",
				use: [
					'css-loader', 
					{
						loader: 'postcss-loader',
						options: {
							plugins: () => {
								return [
									require('autoprefixer')({ browsers: 'last 2 versions' })
								]
							}
						}
					},
					'sass-loader'
				]
			})
		},

		{
			test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
			loaders: [
				{ 
					loader: 'file-loader',
					options: {
						name: 'assets/[name].[ext]'
					}
				},

				'img-loader'
			]
		},

		{ 
			test: /\.js$/, 
			exclude: /node_modules/, 
			loader: "babel-loader"
		}
		]
	},

	plugins: [
		new ExtractTextPlugin('[name].css'),
		new webpack.LoaderOptionsPlugin({
			minimize: inProduction
		}),
		new PurifyCSSPlugin({
      // Give paths to parse for rules. These should be absolute!
      paths: glob.sync(path.join(__dirname, 'index.html')),
      minimize: inProduction
    }),
    new CleanWebpackPlugin(
    	[
			  'dist'
			], 
    	{
    		root:     __dirname,
			  verbose:  true,
			  dry:      false
    	}
  	),
	]
}

if (inProduction) {
	module.exports.plugins.push(
		new webpack.optimize.UglifyJsPlugin()
		)
}
