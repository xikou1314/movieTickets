import {sequelize} from '../../model/index';

export default async (ctx, next) => {
    var responseData={
        code:0,
        msg:"获取角色列表失败"
    };
    await sequelize.query('SELECT * FROM role WHERE deletedAt is null').then(result=>{
        if(result[0].length>0)
        {
            responseData={
                code:1,
                msg:"获取角色列表成功",
                data: result[0]
            };
        }
    })
    ctx.body = responseData;

}

