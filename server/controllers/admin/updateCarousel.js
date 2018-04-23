import {sequelize} from '../../model/index';

export default async (ctx, next) => {
    let responseData={
        code:0,
        msg:'修改轮播图信息失败'
    };

    console.log(ctx.request.body);
    const {title,href,imgUrl,carouselId}=ctx.request.body;
    await  sequelize.query("UPDATE indexcarousel SET title=?,href=?,imgUrl=? WHERE id=?",{
        replacements:[title,href,imgUrl,carouselId]
    }).then(result=>{
        if(result[0].affectedRows>0)
        {
            responseData={
                code:1,
                msg:'修改轮播图成功'
            };
        }
    })
    ctx.body=responseData;

}



