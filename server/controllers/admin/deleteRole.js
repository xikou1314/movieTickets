import {sequelize} from '../../model/index';

export default async (ctx, next) => {
    var responseData={
        code:1,
        msg:"删除角色失败"
    };
    let deletedAt = new Date();
    await sequelize.query('UPDATE role SET deletedAt = ? WHERE roleId=?',{
        replacements:[deletedAt,ctx.query.roleId]
    }).then(res=>{
        if(res[0].affectedRows>0)
        {
            responseData={
                code:0,
                msg:'删除角色成功'
            };
        }
    })
    ctx.body=responseData;
}

