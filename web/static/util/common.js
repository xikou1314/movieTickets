/**
 * @description 将时间格式转化为 x月x日
 * 
 * @param {any} date 
 * @author yh
 */
function getOnTimeDate(date){

    return (date.getMonth()+1)+'月'+date.getDate();


    
}
module.exports=getOnTimeDate;