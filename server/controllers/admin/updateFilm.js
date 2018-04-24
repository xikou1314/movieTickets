import {sequelize} from '../../model/index';
  export default async (ctx, next) => {
    var responseData={
      code:1,
      msg:'电影修改失败'
    };
    console.log(ctx.request.body);
    const { filmName, englishName, introduction, directors, performers, onTime, filmTime, filmId, filmArea, filmClass, filmImgUrl } = ctx.request.body;
    //更新电影的基本信息
    await sequelize.query("UPDATE film SET filmName=?,englishName=?,introduction=?,directors=?,performers=?,onTime=?,filmTime=? WHERE filmId=?",
    {
      replacements:[filmName,englishName,introduction,directors.join('-'),performers.join('-'),new Date(onTime),filmTime,filmId]
    }).then(res=>{
      console.log(res);
    })
    //先将filmtoclass表中电影的类型清空
    await sequelize.query("DELETE FROM filmtoclass WHERE filmId=?",{
      replacements:[filmId]
    });
    //修改电影类型 
    let createdAt=new Date();
    let classSql= 'INSERT INTO filmtoclass VALUES ';
    let params=[];
    for(var i of filmClass)
    {
      classSql+=`(?,?,?,?),`
      params=params.concat([createdAt,createdAt,filmId,i]);
    }
    classSql=classSql.slice(0,-1)+";";
    await sequelize.query(classSql,{
      replacements:params
    });    
    //先将电影区域清空
    await sequelize.query("DELETE FROM filmtoarea WHERE filmId=?",{
      replacements:[filmId]
    });
    //修改电影区域
    classSql= 'INSERT INTO filmtoarea VALUES ';
    params=[];
    for(var i of filmArea)
    {
      classSql+=`(?,?,?,?),`
      params=params.concat([createdAt,createdAt,filmId,i]);
    }
    classSql=classSql.slice(0,-1)+";";
    await sequelize.query(classSql,{
      replacements:params
    }).then(result=>{
      responseData={
        code:0,
        msg:'电影修改成功'
      };
    });
    await sequelize.query('UPDATE posterimg SET url=? WHERE filmId =?',{
      replacements: [filmImgUrl,filmId]
    })
    //根据电影id 修改对应的数据 
    ctx.body = responseData;

  }
  


