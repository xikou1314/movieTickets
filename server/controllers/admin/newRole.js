import {sequelize} from '../../model/index';

export default async (ctx, next) => {
    var responseData={
        code:1,
        msg:"创建角色失败"
    };
    console.log(ctx.request.body);
    var date=new Date();
    var {roleName,permission} = ctx.request.body;
    var roleId=-1;
    await sequelize.query('INSERT INTO role VALUES(null,?,?,?,null)',{
        replacements:[roleName,date,date]
    }).then(result=>{
        roleId=result[0];
    })
    console.log(roleId);
    if(roleId!==-1)
    {
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
                code:0,
                msg:"创建角色成功"
            };
        })
    }
    ctx.body = responseData;

}

