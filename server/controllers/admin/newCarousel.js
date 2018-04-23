import {sequelize} from '../../model/index';

export default async (ctx, next) => {
    var responseData={
        code:1,
        msg:"创建轮播图失败"
    };
    var date=new Date();
    console.log(ctx.request.body);
    const {href,title,imgUrl}=ctx.request.body;
    await sequelize.query("INSERT INTO indexcarousel VALUES(null,?,?,?,?,?,null)",{
        replacements:[href,title,imgUrl,date,date]
    }).then(result=>{
        console.log(result);
        if(result[1]>0) {
            responseData = {
                code: 1,
                msg: '创建轮播图成功',
                carouselId:result[0]
            };
        }
    })
    ctx.body = responseData;

}

