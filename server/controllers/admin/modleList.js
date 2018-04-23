import {sequelize} from '../../model/index';

export default async (ctx, next) => {
    var responseData={
        code:0,
        msg:"获取模块列表失败"
    };
    await sequelize.query('SELECT * FROM modle').then(result=>{
        if(result[0].length>0)
        {
            responseData={
                code:1,
                msg:"获取模块列表成功",
                data: result[0]
            };
        }
    })
    ctx.body = responseData;

}

