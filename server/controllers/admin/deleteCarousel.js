import {sequelize} from '../../model/index';

export default async (ctx, next) => {
    var responseData={
        code:0,
        msg:"删除轮播图失败"
    };
    let deletedAt = new Date();
    await sequelize.query('UPDATE indexcarousel SET deletedAt = ? WHERE id=?',{
        replacements:[deletedAt,ctx.query.carouselId]
    }).then(res=>{
        if(res[0].affectedRows>0)
        {
            responseData={
                code:1,
                msg:'删除轮播图成功'
            };
        }
    })
    ctx.body=responseData;
}

