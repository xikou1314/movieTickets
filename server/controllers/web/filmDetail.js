import {sequelize} from '../../model/index';
  
  export default async (ctx, next) => {
    var responseData={
      code:0,
      msg:"查询电影信息失败"
    };
    //查询电影基本信息
    await sequelize.query(`SELECT * FROM film,posterimg WHERE film.filmId=posterimg.filmId AND film.filmId=${ctx.query.filmId}`).then(res=>{
      if(res[0].length>0)
      {
          responseData={
          code:1,
          msg:'查询电影信息成功',
          data:res[0][0]
        };
      }
    });
    //查询电影的区域
    await sequelize.query(`SELECT * FROM filmarea,filmtoarea WHERE filmarea.areaId=filmtoarea.areaId AND filmId=${ctx.query.filmId}`).then(res=>{
      if(res[0].length>0)
      {
        responseData.data.area=[];
        for(var i of res[0])
        {
          responseData.data.area.push({
            areaId:i.areaId,
            areaName:i.areaName
          })
        }

      }
    });
    //查询电影类型
    await sequelize.query(`SELECT * FROM filmclass,filmtoclass WHERE filmclass.classId=filmtoclass.classId AND filmId=${ctx.query.filmId}`).then(res=>{
      if(res[0].length>0)
      {
        responseData.data.class=[];
        for(var i of res[0])
        {
          responseData.data.class.push({
            classId:i.classId,
            className:i.className
          })
        }

      }
    });
    ctx.body=responseData;
  }

