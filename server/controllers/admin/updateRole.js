import {sequelize} from '../../model/index';

export default async (ctx, next) => {
    let responseData={
        code:0,
        msg:'修改角色信息失败'
    };

    let {roleName,roleId,permission} = ctx.request.body;
    console.log(ctx.request.body);
    //修改角色的基本信息
    let date=new Date();

    await sequelize.query("UPDATE role SET roleName=?,updatedAt=? WHERE roleId=?",{
        replacements:[roleName,date,roleId]
    })

    await sequelize.query("UPDATE permission SET deletedAt=? WHERE roleId=? AND deletedAt is null",{
        replacements:[date,roleId]
    });

    var sql="INSERT INTO permission VALUES";
    var params=[];
    for(var i of permission)
    {
        sql+="(null,?,?,?,?,?,?,?,?,null),"
        params.push(roleId);
        params.push(i.modleId);
        params.push(i.c);
        params.push(i.d);
        params.push(i.u);
        params.push(i.r);
        params.push(date);
        params.push(date);
    }
    await sequelize.query(sql.slice(0,-1),{
        replacements:params
    }).then(res=>{
        responseData={
            code:1,
            msg:"修改角色成功"
        };
    })

    ctx.body=responseData;

}



