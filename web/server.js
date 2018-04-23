var webpack = require('webpack'); // webpack核心
var WebpackDevServer = require('webpack-dev-server'); // webpack提供的服务器插件
var config = require('./webpack.dev.config.js'); // webpack的配置文件 开发模式

/* 下面是创建一个服务对象，固定写法 */
//用开发模式的配置构造有个webpack打包对象 用对象做为参数创建一个webpackdevServer的开发服务器
var server = new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath, // 文件相对引用路径，就用配置文件中配置的
    hot: true, // 是否启用热更新
    inline: true, // 是否实时刷新，即代码有更改，自动刷新浏览器
    historyApiFallback: true, // 所有的url路径均跳转到index.html,需要设置为true，否则比如访问localhost:8888,就跳转不到/home页
    progress: true, // 在控制台输出webpack的编译进度
    stats: { colors: true }, // 不同类型的信息用不同的颜色显示
});

//服务创建后 所有的get请求 都会返回src目录下的index.html
/* 将所有的访问路径，都返回index.html */
server.app.get('*', function(req, res) {
    res.sendFile(__dirname + '/src/index.html')
});
/* 启动服务 */
//启动服务设置监听端口
server.listen(8887, function() {
    console.log('启动服务：8887端口')
});