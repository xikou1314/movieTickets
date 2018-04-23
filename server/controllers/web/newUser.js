import {sequelize} from '../../model/index';
import store from '../../common/store/index';
  export default async (ctx, next) => {
    var responseData={
      code:1,
      msg:"创建用户失败"
    };
    //判断captcha是否有携带 若携带进行比对 若未携带直接过去
    var isPhone = ctx.request.body.isPhone;
    if(isPhone==0)
    {
      var captcha = ctx.request.body.captcha;
      var text = store.getCaptcha(ctx.request.header.host);
      if(captcha!=text.toLowerCase())
      {
        responseData={
          code:2,
          msg:"验证码错误"
        };
        ctx.body = responseData;
        return ;
      }
    }
    var date=new Date();
    var {userName,password} = ctx.request.body;
    var userId=-1;
    await sequelize.query('INSERT INTO user VALUES(null,?,?,?,null,null,null,?,?,null)',{
      replacements:[userName,password,"",date,date]
    }).then(res=>{
      userId=res[0];
    })
    if(userId!==-1)
    {
      await sequelize.query('INSERT INTO usertorole VALUES(null,?,?,?,?,null)',{
        replacements:[userId,"2",date,date]
      }).then(res=>{
        responseData={
          code:0,
          msg:"创建用户成功"
        };
      })
    }
    ctx.body = responseData;

  }

