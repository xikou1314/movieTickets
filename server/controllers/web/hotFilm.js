import {sequelize} from '../../model/index';
import { request } from 'http';

  export default async (ctx, next) => {
    let responseData={
      code:0,
      msg:'获取热门电影失败'
  };
  
  await sequelize.query("SELECT * FROM hotfilm,posterimg,film WHERE hotfilm.filmId=film.filmId AND hotfilm.filmId=posterimg.filmId AND hotfilm.deletedAt is null AND film.deletedAt is null ORDER BY onTime LIMIT 12").then(result=>{
    if(result[0].length>0)
    {
      responseData={
        code:1,
        msg:'获取热门电影成功',
        data:result[0]
      }
    }
  });

  ctx.body=responseData;


  
    

    
  }
   


