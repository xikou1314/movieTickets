import React from 'react';
import { Link,browserHistory } from 'react-router';
import moment from 'moment';
import request from '../../../static/util/request';
import Header from '../../component/header';
import Footer from '../../component/footer'
import '../../../static/css/detail.css';
import { Tabs,message } from 'antd';
import config from "../../config";
const TabPane = Tabs.TabPane;
class DetailPageContainer extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
          filmInfo:[],
          dayIndex:1,
          arrangeItem:[]
        };
    };
    //根据电影id 查询电影详情
    getFilmInfo(){
      request({
        url:"filmDetail",
        type:"get",
        data:"filmId="+this.props.routeParams.filmId
      }).then(res=>{
      
        if(res.code==1)
        {
          this.setState({
            filmInfo:res.data
          });
        }
      })
    }
    //根据当前日期加载七天内的票
    initDate(){

       var now = new Date();
       var dateItems=[];
       now.setDate(now.getDate()-1);
       for(let i=1;i<=7;i++)
       {
         let tempDate=new Date(now.setDate(now.getDate()+1));
         dateItems.push(
          <div className={i===this.state.dayIndex?"date-item date-item-active":"date-item"} onClick={e=>this.selectDay(i,tempDate)}>
          {tempDate.getMonth()+1+"月"+tempDate.getDate()+"日"}
          </div>
         );

       }

       return dateItems;
    }
    componentWillMount(){
      this.getFilmInfo();
      console.log(this.props);
     
    }
    componentDidMount(){
      this.selectDay(1,new Date());
    }
    selectDay(index,date){
      this.setState({
        dayIndex:index
      });
      //根据选择的时间 电影的id查询场次的安排
      request({
        url:"searchArrange",
        type:"get",
        data:{
          filmId:this.props.routeParams.filmId,
          date:date
        }
      }).then(res=>{
        console.log(res);
        if(res.code==0)
        {
          var arrangeItem=[];
          if(res.data.length>0)
          {
            for(let i of res.data)
            {
              arrangeItem.push(<div className="arrangeItem">
              <span>{i.start.slice(0,5)}~{i.end.slice(0,5)}</span>
              <span>{i.roomName}</span>
              <span>{i.price}元</span>
              <span><span className="seat-select" onClick={e=>this.jumpToBooking(i.arrangeId)}>选座购票</span></span>
            </div>)
            }
          }
          else{
            arrangeItem.push(
              <div className="arrangeItem">暂无放映安排</div>
            )
          }
 
          console.log(arrangeItem);
          this.setState({
            arrangeItem:arrangeItem
          })
        }
      }).catch(err=>{
        message.error("网络错误!请稍后重试...");
      })
    }
    jumpToBooking(arrangeId){
      browserHistory.push(
        {pathname: '/booking',state: { arrangeId  }}
    );
    }
    render(){
      const {filmInfo} = this.state;
    return (<div>
      <Header></Header>
      <div className="content">
        <div className="detail-back clear">
          <div className="left-container">
            <img src={config.baseUrl+this.state.filmInfo.url} />
          </div>
          <div className="right-container">
            <div className="info-title">
              <h1>{filmInfo.filmName}</h1>
              <h2>{filmInfo.englishName}</h2>
            </div>
            <div className="info-content">
              <ul>
                <li>上映时间: <span>{moment(filmInfo.onTime).format('YYYY-MM-DD')}</span></li>
                <li>片长: <span>{filmInfo.filmTime}</span></li>
                <li>导演: <span>{filmInfo.directors?filmInfo.directors.replace(/-/g, "/"):""}</span></li>
                <li>演员: <span>{filmInfo.performers?filmInfo.performers.replace(/-/g, "/"):""}</span></li>
                <li>类型: <span>{filmInfo.class?filmInfo.class.map(value=>{
                  return value.className+" ";
                }):""}</span></li>
                <li>地区: <span>{filmInfo.area?filmInfo.area.map(value=>{
                  return value.areaName+" ";
                }):""}</span></li>
              </ul>
            </div>
          </div>
        </div>
        <Tabs defaultActiveKey="1" className="detail-tabs">
          <TabPane tab="排片购票" key="1">
                <div className="date-header">
                {
                  this.initDate()
                }
                </div>
                <div className="arrange-table">
                  <div className="arrange-header">
                    <span>时间</span>
                    <span>放映厅</span>
                    <span>价格</span>
                    <span>选座购票</span>
                  </div>
                  <div className="arrange-content">
                    {
                      this.state.arrangeItem
                    }
                  </div>
                </div>
          </TabPane>
          <TabPane tab="介绍" key="2">暂无介绍</TabPane>
          <TabPane tab="资讯" key="3">暂无资讯</TabPane>
        </Tabs>
      </div>
      <Footer></Footer>
    </div>);
    };


};
DetailPageContainer.propTypes={
  routeParams:React.PropTypes.any
}

export default DetailPageContainer;