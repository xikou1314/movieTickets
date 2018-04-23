import path from 'path';
import views from 'koa-views';
import json from 'koa-json';
import logger from 'koa-logger';
import koaStatic from 'koa-static-plus';
import koaOnError from 'koa-onerror';
import convert from 'koa-convert';
import Bodyparser from 'koa-bodyparser';
import router from './routes';          //导入后端路由
import config from './common/config';  //导入默认配置


const jwtKoa = require('koa-jwt');

const bodyparser = Bodyparser();        //post请求
const templatePath = path.join(__dirname, './templates');
const cors = require('koa2-cors');

export default (app) => {
  // reg middlewares 注册中间件
  app.use(convert(bodyparser));
  app.use(convert(json()));
  app.use(convert(logger()));
  //允许跨域
  app.use(cors({
    origin: function (ctx) {
        if (ctx.url === '/test') {
            return "*"; // 允许来自所有域名请求
        }
        return '*'; // 这样就能只允许 http://localhost:8080 这个域名的请求了
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
  //检验权限
  app.use(jwtKoa({ secret: 'shared-secret' }).unless({
    path: [/^\/api\/login/,/^\/uploads/,/^\/avatar/,/^\/web/] //数组中的路径不需要通过jwt验证
  }));

  // static serve 静态文件的处理
  app.use(convert(koaStatic(__dirname+"/public")));

  // router dispatcher 绑定后端路由
  app.use(router);





    

  // logger 若为开发环境 打印日志
  if (app.env === 'development') {
    app.use(async (ctx, next) => {
      const start = new Date();
      await next();
      const ms = new Date() - start;
      console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
    })
  }

  // 404
  app.use(async (ctx) => {
    ctx.status = 404;
    await ctx.render('404');
  })


}
