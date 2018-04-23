import {sequelize} from '../../model/index';
import store from '../../common/store/index';
var svgCaptcha = require('svg-captcha');
export default async (ctx, next) => {
  var captcha = svgCaptcha.create({fontSize:50,width:100,height:40});
  console.log(ctx);
  //数据换地方保存
  // var text=captcha.text;
  if(store.getCaptcha(ctx.request.header.host))
  {
    store.deleteCaptcha(ctx.request.header.host);
  }
  store.setCaptcha(ctx.request.header.host,captcha.text);
  console.log(captcha);
  ctx.body = captcha.data;

}

