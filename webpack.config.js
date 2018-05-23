const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
var AssetsPlugin = require('assets-webpack-plugin');
var assetsPluginInstance = new AssetsPlugin({ filename: 'assets.json' });

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);

    const sharedConfig = () => ({
        stats: { modules: false },
        resolve: {
            extensions: ['.js', '.jsx'],
            alias: {
                'jquery.validation': 'jquery-validation/dist/jquery.validate.js'
            }
        },
        output: {
            filename: isDevBuild ? '[name].js' : '[name]-[hash].js',
            publicPath: '/'
        },
        module: {
            rules: [
                { test: /\.jsx?/, exclude: /node_modules/, loader: 'babel-loader' },
                { test: /.(png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=.]+)?$/, use: 'url-loader?limit=25000' },
                { test: /\.json$/, loader: 'json-loader' }
            ]
        }
    });

    // Configuration for client-side bundle suitable for running in browsers
    const clientBundleOutputDir = './dist';
    const clientBundleConfig = merge(sharedConfig(), {
        entry: { 'bundle': (isDevBuild ? [
            'react-hot-loader/patch',
            'webpack/hot/only-dev-server'] : []).concat(['./index.jsx', './less/site.less', 'babel-polyfill']) },
        devServer: {
            contentBase: './assets',
            hot: true,
            host: process.env.HOST || 'localhost',
            proxy: [{
                context: ['/**', '!/img/**', '!/fonts/**', '!/sound/**'],
                target: `http://${process.env.HOST || 'localhost'}:4000`
            }]
        },
        devtool: isDevBuild ? 'inline-source-map' : 'source-map',
        module: {
            rules: isDevBuild ? [
                {
                    test: /\.css$/, use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']
                },
                {
                    test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader']
                }
            ] : [
                {
                    test: /\.css$/, use: ExtractTextPlugin.extract(['css-loader?minimize'])
                },
                {
                    test: /\.less$/, use: ExtractTextPlugin.extract(['css-loader?minimize', 'less-loader'])
                },
                {
                    test: /\.scss$/, use: ExtractTextPlugin.extract(['css-loader?minimize', 'sass-loader'])
                }
            ]
        },
        output: { path: path.join(__dirname, clientBundleOutputDir) },
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery'
            })
        ].concat(isDevBuild ? [
            new webpack.NamedModulesPlugin(),
            new webpack.HotModuleReplacementPlugin()
        ] : [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./dist/vendor-manifest.json')
            }),
            new ExtractTextPlugin('site-[hash].css'),
            assetsPluginInstance
        ])
    });

    return clientBundleConfig;
};
