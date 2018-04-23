import {sequelize} from '../../model/index';
import { request } from 'http';
  let responseData={
    code:0,
    msg:'创建电影失败'
};
  export default async (ctx, next) => {

    //获取电影名称 英文名称 电影类型 电影区域 导演 演员 简介 电影时长 海报等信息
    let requestData=ctx.request.body;
    
    //将信息存入对应的表中。
    console.log(requestData);
 

    const {directors,performers,filmName,englishName,filmClass,filmArea,introduction,filmTime,filmImgUrl,onTime} = ctx.request.body;
   
    let createdAt = new Date();
    //在电影基本信息表中插入信息
    let insertId=-1;
    let myOnTime = new Date(onTime)
    
    await sequelize.query('INSERT INTO film VALUES (NULL,?,?,?,?,?,NUll,?,?,?,?); ',{
      replacements: [filmName,englishName,introduction,createdAt,createdAt,directors.join('-'),performers.join('-'),myOnTime,filmTime]
    }).then(function(result){       //result 插入成功后返回一个数组 第一个为插入的id 第二个为影响的行数
      insertId=result[0]; 

    })
 
    if(insertId!==-1)
    {
      //插入电影类型
      let classSql= 'INSERT INTO filmtoclass VALUES ';
      let params=[];
      for(var i of filmClass)
      {
        classSql+=`(?,?,?,?),`
        params=params.concat([createdAt,createdAt,insertId,i]);
      }
      classSql=classSql.slice(0,-1)+";";
      await sequelize.query(classSql,{
        replacements:params
      });    
      //插入电影区域
      classSql= 'INSERT INTO filmtoarea VALUES ';
      params=[];
      for(var i of filmArea)
      {
        classSql+=`(?,?,?,?),`
        params=params.concat([createdAt,createdAt,insertId,i]);
      }
      classSql=classSql.slice(0,-1)+";";
      await sequelize.query(classSql,{
        replacements:params
      });
      //插入电影的海报图片
      
      await sequelize.query('INSERT INTO posterimg VALUES (NULL,?,?,?,?)',{
        replacements:[filmImgUrl,createdAt,createdAt,insertId]
      });
      
      responseData={
        code:1,
        msg:'创建电影成功'
      }



    }

    ctx.body=responseData;


  
    

    
  }
   


