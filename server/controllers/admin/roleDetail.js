import {sequelize} from '../../model/index';

export default async (ctx, next) => {
    var responseData={
        code:1,
        msg:"查询角色信息失败"
    };

    var permission=[];
    await sequelize.query("SELECT * FROM permission,modle WHERE permission.modleId=modle.modleId AND roleId=?",{
        replacements:[ctx.query.roleId]
    }).then(result=>{
        if(result[0].length>0)
        {
            permission=result[0];
        }
    })
    await sequelize.query(`SELECT * FROM role WHERE roleId=${ctx.query.roleId}`).then(res=>{
        if(res[0].length>0)
        {
            responseData={
                code:0,
                msg:'查询角色信息成功',
                data:res[0][0],
                permission
            };
        }
    });

    ctx.body=responseData;
}

