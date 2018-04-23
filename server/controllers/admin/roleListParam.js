import {sequelize} from '../../model/index';

export default async (ctx, next) => {
    var responseData={
        code:0,
        msg:"获取角色列表失败"
    };
    console.log(ctx.query);
    var sql=""
    if(ctx.query.roleName || ctx.query.roleId)
    {
        if(ctx.query.roleName && ctx.query.roleId)
            sql+=` AND roleName like "%${ctx.query.roleName}%" AND roleId like "%${ctx.query.roleId}%"`;
        else if(ctx.query.roleName)
            sql+=` AND roleName like "%${ctx.query.roleName}%" `;
        else
            sql+=` AND roleId like "%${ctx.query.roleId}%" `;
    }
    await sequelize.query('SELECT * FROM role WHERE deletedAt is null'+sql).then(result=>{
        if(result[0].length>0)
        {
            responseData={
                code:1,
                msg:"获取角色列表成功",
                data: result[0]
            };
        }
    })
    ctx.body = responseData;

}

