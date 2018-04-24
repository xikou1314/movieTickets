import {sequelize} from '../../model/index';

  export default async (ctx, next) => {
    
    let data=[];
    let response={
      code:0,
      msg:'获取电影列表失败'
    }
    
    console.log(ctx.request.query);
    //根据电影名称查询 根据电影id查询 根据导演名称查询 根据演员姓名查询
    let search="";
    if(ctx.request.query.filmName || ctx.request.query.director || ctx.request.query.performer || ctx.request.query.filmId)
    {
      for(let i in ctx.request.query)
      {
        if(ctx.request.query[i])
        {
          console.log(ctx.request.query[i]);
          switch(i){
            case 'filmName':
              search+=' AND filmName LIKE "%'+ctx.request.query[i]+'%" ';
              break;
            case 'director':
              search+=' AND directors LIKE "%'+ctx.request.query[i]+'%" ';
              break;
            case 'performer':
              search+=' AND performers LIKE "%'+ctx.request.query[i]+'%" ';
              break;
            case 'filmId':
            search+=' AND filmId LIKE "%'+ctx.request.query[i]+'%" ';
            break;
          }
        } 
      }
      await sequelize.query('SELECT * FROM film WHERE '+search.slice(4)+' AND deletedAt is null').then(result=>{
     
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
  


