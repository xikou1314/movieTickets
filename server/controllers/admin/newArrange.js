import {sequelize} from '../../model/index';
//两个时间相差天数 兼容firefox chrome
function datedifference(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式  
  var dateSpan,
      tempDate,
      iDays;
  sDate1 = Date.parse(sDate1);
  sDate2 = Date.parse(sDate2);
  dateSpan = sDate2 - sDate1;
  dateSpan = Math.abs(dateSpan);
  iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
  return iDays
};
  export default async (ctx, next) => {
    var responseData={
      code:1,
      msg:"创建排片失败"
    };
    console.log(ctx.request.body);
    const {showTime,start,end,price,room,filmDetail}=ctx.request.body;
    var days=datedifference(showTime[0],showTime[1]);
    console.log(days);
    var date=new Date(showTime[0]);
    var filmId=filmDetail.filmId;
    var startTime=new Date(start);
    var endTime=new Date(end);
    var sql="INSERT INTO arrange VALUES";
    var now=new Date();
    var params=[];
    for(var i=1;i<=days;i++)
    {
      console.log(i);
      date.setDate(date.getDate()+1);
      console.log(date);
      //遍历room
      for(var j of room)
      {
        var dateTmp=new Date(date);
        sql+="(null,?,?,?,?,?,?,?,?,null),";
        params.concat([
          filmId,j.roomId,date,startTime,endTime,price,now,now
        ]);
        params.push(filmId);
        params.push(j.roomId);
        params.push(dateTmp);
        params.push(startTime);
        params.push(endTime);
        params.push(price);
        params.push(now);
        params.push(now);
      }
    }

    await sequelize.query(sql.slice(0,-1),{replacements:params}).then(result=>{
      console.log(result);
      if(result[1]>0)
      {
        responseData={
          code:0,
          msg:"创建排片成功"
        };
      }
    }).catch(err=>{
      console.log(err);
    });
    //查询当前排片的filmId是否存在于hotFilm表中
    //1：若存在 不做任何操作
    //2：若不存在 向hotFilm表中插入一条数据
    var hotFilmFlag = false;
    await sequelize.query("SELECT * FROM hotfilm WHERE filmId=?",{
      replacements:[filmId]
    }).then(result=>{
        if(result[0].length>0)
        {
          hotFilmFlag = true;
        }
    });
    if(!hotFilmFlag) {
      await sequelize.query("INSERT INTO hotfilm VALUES(null,?,?,?,null)", {
        replacements: [filmId, now, now]
      });
    }
    ctx.response.body=responseData;
  }

