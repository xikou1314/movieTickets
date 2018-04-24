import {sequelize} from '../../model/index';

export default async (ctx, next) => {


    let responseData={
        code:0,
        msg:'获取轮播图列表失败'
    }
    await sequelize.query("SELECT * FROM indexcarousel WHERE deletedAt is null").then(result=>{

        if(result[0].length>0)
        {
            responseData={
                code:1,
                msg:'获取轮播图列表成功',
                data:result[0]
            }
        }
    })



    ctx.body = responseData;
}



