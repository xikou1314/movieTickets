import {sequelize} from '../../model/index';

  Date.prototype.format = function(format)
  {
  var o = {
  "M+" : this.getMonth()+1, //month
  "d+" : this.getDate(),    //day
  "h+" : this.getHours(),   //hour
  "m+" : this.getMinutes(), //minute
  "s+" : this.getSeconds(), //second
  "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
  "S" : this.getMilliseconds() //millisecond
  }
  if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
  (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)if(new RegExp("("+ k +")").test(format))
  format = format.replace(RegExp.$1,
  RegExp.$1.length==1 ? o[k] :
  ("00"+ o[k]).substr((""+ o[k]).length));
  return format;
  }
  export default async (ctx, next) => {
    var responseData={
      code:1,
      msg:"查询场次失败"
    };
    console.log(ctx.request.query);
   
    var date=new Date(ctx.request.query.date).format("yyyy-MM-dd");
    var current=new Date().format("hh:mm:ss");
    //根据电影id 时间查询场次
    await sequelize.query("SELECT * FROM arrange,filmroom WHERE arrange.roomId=filmroom.roomId AND filmId=? AND date=? AND start>?  ORDER BY start",{
      replacements:[ctx.request.query.filmId,date,current]
    }).then(result=>{
      console.log(result);
      responseData={
        code:0,
        msg:"查询场次成功",
        data:result[0]
      }
    }).catch(err=>{
      console.log(err);
    })
    ctx.body = responseData;

  }

