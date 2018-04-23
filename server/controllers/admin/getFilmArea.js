import {sequelize} from '../../model/index';
  var data=[];
  var response={
      code:0,
      msg:'获取电影区域列表失败'
  }
  export default async (ctx, next) => {
    
    await sequelize.query('SELECT * FROM filmarea WHERE deletedAt is null').then(function(result){
      data=[];
      for(var item of result[0])
      {
          data.push({
              areaId:item.areaId,
              areaName:item.areaName
          })
      }

      response.code=1;
      response.msg="获取电影区域列表成功";
      response.data=data;

    })

    ctx.body = response;

  }
  


