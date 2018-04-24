import {sequelize} from '../../model/index';

  export default async (ctx, next) => {
    
    let data=[];
    let responseData={
      code:0,
      msg:'获取排片列表失败'
    }
    console.log(ctx.request.query);
    var search="";
    if(ctx.request.query.filmName || ctx.request.query.arrangeId || ctx.request.query.roomName)
    {
      
      for(var i in ctx.request.query)
      {
        switch(i)
        {
          case "filmName":
                search+=' AND filmName LIKE "%'+ctx.request.query[i]+'%" ';
                break;
          case "roomName":
                search+=' AND roomName LIKE "%'+ctx.request.query[i]+'%" ';
                break;
          case "arrangeId":
                search+=' AND arrangeId LIKE "%'+ctx.request.query[i]+'%" ';
                break;
        }
      }
      await sequelize.query("SELECT * FROM arrange,film,filmroom WHERE arrange.filmId=film.filmId AND arrange.roomId=filmroom.roomId AND "+search.slice(4)+' AND arrange.deletedAt is null AMD film.deletedAt is null AND filmroom.deletedAt is null').then(res=>{
        console.log(res);
        if(res[0].length>0)
        {
          responseData={
            code:1,
            msg:'获取排片列表成功',
            data:res[0]
          }
        }
      })
     
    }else{
      await sequelize.query("SELECT * FROM arrange,film,filmroom WHERE arrange.filmId=film.filmId AND arrange.roomId=filmroom.roomId AND arrange.deletedAt is null AND film.deletedAt is null AND filmroom.deletedAt is null").then(res=>{
      
        if(res[0].length>0)
        {
          responseData={
            code:1,
            msg:'获取排片列表成功',
            data:res[0]
          }
        }
      })
  
    }
   

    ctx.body = responseData;
  }
  


