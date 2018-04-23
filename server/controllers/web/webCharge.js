
var API_KEY = 'sk_test_v9uTi5v58KK4DKC4qLzDOGiT';

var APP_ID = 'app_f5urzHTyDqr50aHy';

var pingpp = require('pingpp')(API_KEY);
var charge_extra = require('./charge_extra');
pingpp.setPrivateKeyPath(__dirname + '/rsa_private_key.pem');
export default async (ctx, next) => {
  var responseData = {
    code:0,
    msg:"请求charge失败"
  }
  pingpp.parseHeaders(ctx.request.header); // 把从客户端传上来的 Headers 传到这里
  var channel = 'alipay_pc_direct'; // 支付使用的第三方支付渠道取值，请参考：https://www.pingxx.com/api#api-c-new
  var extra = charge_extra(channel);
  var order_no = new Date().getTime().toString().substr(0, 10);
  await pingpp.charges.create({
    order_no:  order_no, // 推荐使用 8-20 位，要求数字或字母，不允许其他字符
    app:       { id: APP_ID },
    channel:   channel, // 支付使用的第三方支付渠道取值，请参考：https://www.pingxx.com/api#api-c-new
    amount:    ctx.request.body.amount*100, //订单总金额, 人民币单位：分（如订单总金额为 1 元，此处请填 100）
    client_ip: '127.0.0.1', // 发起支付请求客户端的 IP 地址，格式为 IPV4，如: 127.0.0.1
    currency:  'cny',
    subject:   'Your Subject',
    body:      'Your Body',
    extra:     extra
  }).then(function(charge){
    console.log(charge);
    responseData = {
      code:1,
      msg:"请求charge成功",
      charge
    }
  }).catch(function(err){
      console.log(err);
  });
  ctx.body = responseData;
}

