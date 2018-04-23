import {sequelize} from '../../model/index';
  var data=[];
  var response={
      code:0,
      msg:'获取电影类型列表失败'
  }
  export default async (ctx, next) => {

    await sequelize.query('SELECT * FROM filmclass WHERE deletedAt is null').then(function(result){
      data=[];
      for(var item of result[0])
      {
          data.push({
              classId:item.classId,
              className:item.className
          })
      }

      response.code=1;
      response.msg="获取电影类型列表成功";
      response.data=data;

    })

    ctx.body = response;

  }
  


