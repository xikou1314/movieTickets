import {sequelize} from '../../model/index';

export default async (ctx, next) => {
    var responseData={
        code:0,
        msg:"查询电影信息失败"
    };
    console.log(ctx.request.query);
    //查询影厅基本信息
    await sequelize.query(`SELECT * FROM film,posterimg WHERE film.filmId=posterimg.filmId AND filmName like "%${ctx.request.query.filmName}%"`).then(res=>{
        if(res[0].length>0)
        {
            responseData={
                code:1,
                msg:'查询电影信息成功',
                data:res[0]
            };
            console.log(res[0]);
        }
    });
    ctx.body=responseData;
}

