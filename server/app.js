import Koa from 'koa';     //导入koa服务器 
import middlewareRegister from './middlewareRegister';  //导入中间件注册模块
import http from 'http';  //导入http模块
import config from './common/config/';  //导入默认配置

import {sequelize} from './model/index';
const app = new Koa();  //声明koa
app.env = 'production'; //声明当前环境为生产环境

middlewareRegister(app); // reg middleware

sequelize.sync().then(function(){
  console.log("database has synced");
})




module.exports = app;

