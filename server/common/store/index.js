var store={
    _item:[],
    getItem:function(){
      return this._item;
    },
    setItem:function(ip,text){
      var item = this.getItem();
      item.push({
        ip,
        text
      });
    },
    clearItem:function(){
      this._item = [];
    },
    setCaptcha:function(ip,text)
    {
      this.setItem(ip,text);
    },
    getCaptcha:function(ip){
      var item = this.getItem();
      //根据ip地址查找text
      for(var i=0;i<item.length;i++)
      {
        if(item[i].ip!=ip)
          continue;
        return item[i].text;
      }
      return null;
    },
    deleteCaptcha:function(ip){
      var item = this.getItem();
      //根据ip地址查找text
      for(var i=0;i<item.length;i++)
      {
        if(item[i].ip!=ip)
          continue;
        else{
          item.splice(i,1);
          break;
        }
      }
    }

}
export default store;