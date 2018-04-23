var path = require('path');
var webpack = require('webpack'); 

var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src'); 
var APP_FILE = path.resolve(APP_PATH, 'app'); 
var BUILD_PATH = path.resolve(ROOT_PATH, '/build'); 

module.exports = {
    entry: {
        app: [
            'webpack-dev-server/client?http://localhost:8888', 
            'webpack/hot/only-dev-server', 
            APP_FILE   
        ]
    },
    output: {
        publicPath: '/test/',  
        path: BUILD_PATH, 
        filename: 'bundle.js', 
    },
    devtool: 'source-map',

    module: {
    
        preLoaders: [
          {
            test: /\.js?$/, 
            loader: 'eslint', 
            exclude: /node_modules/, 
          },
        ],
        loaders: [

            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query:{
                    plugins:[
                        ['import', [{ libraryName: "antd", style: 'css' }]],
                    ],
                }
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css'],
            },
            {
                test: /\.less$/,
                loaders: ['style', 'css', 'less'],
            },
            {
                test: /\.(eot|woff|svg|ttf|woff2|gif|appcache|mp3)(\?|$)/,
                exclude: /node_modules/,
                loader: 'file-loader?name=[name].[ext]',
            },
            {
                test: /\.(png|jpg|gif)$/,
                exclude: /node_modules/,
                loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]',
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),   
        new webpack.NoErrorsPlugin()   
    ],
    resolve: {
        extensions: ['', '.js', '.jsx', '.less', '.css'], 
    },
    externals: {
        "jquery": "jQuery"
    }
};