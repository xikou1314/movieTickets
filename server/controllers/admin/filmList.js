import {sequelize} from '../../model/index';

  export default async (ctx, next) => {
    
    let data=[];
    let response={
      code:0,
      msg:'获取电影列表失败'
    }
    console.log(ctx.request.body);
  
    //模糊查询 根据前端上传的日期范围 电影名称 导演 演员 模糊查询film表
    let search='';
    let dateFrom=null;
    let dateTo=null;
    if(ctx.request.body.filmName || ctx.request.body.director || ctx.request.body.performer || ctx.request.body.dateFrom)
    {
      for(let i in ctx.request.body)
      {
        if(ctx.request.body[i])
        {
          console.log(ctx.request.body[i]);
          switch(i){
            case 'filmName':
              search+=' AND filmName LIKE "%'+ctx.request.body[i]+'%" ';
              break;
            case 'director':
              search+=' AND directors LIKE "%'+ctx.request.body[i]+'%" ';
              break;
            case 'performer':
              search+=' AND performers LIKE "%'+ctx.request.body[i]+'%" ';
              break;
            case 'dateFrom':
              search+=' AND onTime > ? ';
              dateFrom=new Date(ctx.request.body[i]);
              break;
            case 'dateTo':
              search+=' AND onTime < ? ';
              dateTo=new Date(ctx.request.body[i]);
              break;
          }
        }
   
  
       
      }
  
      if(ctx.request.body['dateFrom'] && ctx.request.body['dateTo'])
      {
      await sequelize.query('SELECT * FROM film WHERE '+search.slice(4)+' AND deletedAt is null',{
        replacements: [dateFrom,dateTo]
      }).then(result=>{
        if(result[0].length>0)
        {
          response={
            code:1,
            msg:'获取电影列表成功',
            data:result[0]
          }
        }
  
      }) 
      }
      else{
        await sequelize.query('SELECT * FROM film WHERE '+search.slice(4)+' AND deletedAt is null').then(result=>{
          console.log(result);
          if(result[0].length>0)
          {
            response={
              code:1,
              msg:'获取电影列表成功',
              data:result[0]
            }
          }
        }) 
      }
    }
    else{
      await sequelize.query("SELECT * FROM film WHERE deletedAt is null").then(result=>{
        if(result[0].length>0)
        {
          response={
            code:1,
            msg:'获取电影列表成功',
            data:result[0]
          }
        }
      })
    }

    ctx.body = response;
  }
  


