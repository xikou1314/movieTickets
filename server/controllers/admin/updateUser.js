import {sequelize} from '../../model/index';

export default async (ctx, next) => {
    let responseData={
        code:0,
        msg:'修改用户信息失败'
    };

    let requestData=ctx.request.body;
    let {userName,password,name,phone,email,roleId,userId} = ctx.request.body;
    console.log(ctx.request.body);
    //修改用户的基本信息
    let date=new Date();

    await sequelize.query("UPDATE user SET userName=?,password=?,name=?,phone=?,email=?,updatedAt=? WHERE userId=?",{
        replacements:[userName,password,name,phone,email,date,userId]
    })

    await sequelize.query("UPDATE usertorole SET deletedAt=? WHERE userId=? AND deletedAt is null",{
        replacements:[date,userId]
    });

    let sql="INSERT INTO usertorole VALUES ";
    let replacements=[];
    for(var i in roleId)
    {
        sql+="(null,?,?,?,?,null),"
        replacements=replacements.concat([userId,roleId[i],date,date]);
    }
    await sequelize.query(sql.slice(0,-1)+";",{
        replacements:replacements
    }).then(res=>{
        if(res[1]>0)
        {
            responseData={
                code:1,
                msg:'修改用户信息成功'
            };
        }
    })

    ctx.body=responseData;

}



