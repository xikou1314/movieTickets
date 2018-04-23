import {sequelize} from '../../model/index';

export default async (ctx, next) => {
    var responseData = {
        code: 0,
        msg: "查询电影列表失败"
    };
    var sql = "";
    var params = [];
    var date1, date2;
    //若电影类型不为空
    var filmId = [];
    if (ctx.request.query.class) {
        await sequelize.query("SELECT * FROM filmclass,filmtoclass WHERE filmclass.classId=filmtoclass.classId AND className=?", {
            replacements: [ctx.request.query.class]
        }).then(result => {

            if (result[0].length > 0) {
                for (var i of result[0]) {
                    filmId.push(i.filmId);
                }
            }
        })
    }
    if (ctx.request.query.area) {
        await sequelize.query("SELECT * FROM filmarea,filmtoarea WHERE filmarea.areaId=filmtoarea.areaId AND areaName=?", {
            replacements: [ctx.request.query.area]
        }).then(result => {
            if (result[0].length > 0) {
                for (var i of result[0]) {
                    filmId.push(i.filmId);
                }
            }
        })
    }
    filmId = Array.from(new Set(filmId));
    if (ctx.request.query.age) {
        switch (ctx.request.query.age) {
            case "2018":
                date1 = new Date("2018-1-1");
                date2 = new Date("2018-12-31")
                break
            case "2017":
                date1 = new Date("2017-1-1");
                date2 = new Date("2017-12-31")
                break;
            case "2016":
                date1 = new Date("2016-1-1");
                date2 = new Date("2016-12-31")
                break;
            case "2010~2015":
                date1 = new Date("2010-1-1");
                date2 = new Date("2015-12-31")
                break;
            case "2000~2009":
                date1 = new Date("2000-1-1");
                date2 = new Date("2009-12-31")
                break;
            case "90年代":
                date1 = new Date("1990-1-1");
                date2 = new Date("1999-12-31")
                break;
            case "90年代以前":
                date1 = new Date("1900-1-1");
                date2 = new Date("1989-12-31")
                break;
        }
    }
    if (filmId.length > 0 && ctx.request.query.age) {
        sql += "WHERE film.filmId=posterimg.filmId AND film.filmId in (?) AND onTime between ? and ?";
        params.push(filmId);
        params.push(date1);
        params.push(date2);
    }
    else if (filmId.length > 0) {
        sql += "WHERE film.filmId=posterimg.filmId AND film.filmId in (?)";
        params.push(filmId);
    }
    else if (ctx.request.query.age) {
        sql += "WHERE film.filmId=posterimg.filmId AND onTime between ? and ?";
        params.push(date1);
        params.push(date2);
    }
    else {
        sql += "WHERE film.filmId=posterimg.filmId ";
    }
    if (filmId.length <= 0 && (ctx.request.query.class || ctx.request.query.area))
    {
        responseData = {
            code: 0,
            msg: "查询电影列表失败"
        };
    }
    else{
        var count=0;
        await sequelize.query("SELECT * FROM film,posterimg "+sql,{
            replacements:params
        }).then(result=>{
            count=result[0].length;
        });

        await sequelize.query("SELECT * FROM film,posterimg "+sql+"limit "+(Number(ctx.request.query.page)-1)*10+","+10,{
            replacements:params
        }).then(result=>{
            console.log(result);
            responseData = {
                code: 1,
                msg: "查询电影列表成功",
                data: result[0],
                count:count
            };
        });
    }



    ctx.body=responseData;
}

