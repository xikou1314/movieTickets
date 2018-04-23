import {sequelize} from '../../model/index';

export default async (ctx, next) => {
    let responseData={
        code:0,
        msg:'查询用户列表失败'
    };

    const {userName,userId}=ctx.request.query;
    console.log(ctx.request.query);
    await sequelize.query(`SELECT * FROM user WHERE deletedAt is null AND userName like "%${userName}%" AND userId like "%${userId}%"`).then(result=>{
        if(result[0].length>0)
        {
            responseData={
                code:1,
                msg:'查询用户列表成功',
                data: result[0]
            };
        }
    }).catch(err=>{
        console.log(err);
    });
    ctx.body=responseData;
}



