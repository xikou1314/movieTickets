import {sequelize} from '../../model/index';
import config from '../../common/config/index';
const jwt = require('jsonwebtoken');
  var responseData={};
  export default async (ctx, next) => {
    var userName = ctx.request.body.userName || '',
    password = ctx.request.body.password || '';
    console.log(ctx.session);
    await sequelize.query('SELECT * FROM user WHERE userName = ? AND password = ? AND deletedAt is null',
    { replacements: [userName,password], type: sequelize.QueryTypes.SELECT }
    ).then(function(result){
        console.log(result);
        if(result.length>0)
        {
            var userToken = {
                name: userName
            };
            var token = jwt.sign(userToken, "shared-secret", {expiresIn: '24h'}) 
            responseData={
                code:0,
                msg:"登录成功",
                data:{
                    user:{
                        name:result[0].name,
                        userId:result[0].userId,
                        avatar:result[0].avatar
                        },
                    token:token
                },

            }
        }
        else{
            responseData={
                code:1,
                msg:"登录失败"
            };
        }

    }).catch(function(err){
        responseData={
            code:1,
            msg:"登录失败"
        };
    })

    ctx.body = responseData;

  }

