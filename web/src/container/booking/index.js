import React from 'react';
import { Link,browserHistory } from 'react-router';
import { Steps, Button, message, Modal } from 'antd';
import Header from '../../component/header';
import Footer from '../../component/footer';
import '../../../static/css/booking.css';
import screen from '../../../static/files/img/booking/screen.png';
import request from '../../../static/util/request';
import {session,local} from '../../../static/util/storage';
import ok from '../../../static/files/img/booking/ok.png';
const Step = Steps.Step;
const confirm = Modal.confirm;
var pingpp = require('pingpp-js');
class BookingPageContainer extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            row:5,
            column:5,
            seats:[],
            roomInfo:[],
            filmDetail:[],
            selected:[],
            current:0,
            selectedSeat:[],
            charge:null
        };
        this.handleBuy=this.handleBuy.bind(this);
        this.pay=this.pay.bind(this);
    };


    init(){
        //根据场次id加载对应的影厅的信息
        request({
            url:"roomInfo",
            type:"get",
            data:{arrangeId:this.props.location.state.arrangeId}
        }).then(res=>{
    
            if(res.code===1 && res.data)
            {
                this.setState({
                    row:res.data[0].row,
                    column:res.data[0].column,
                    roomInfo:res.data[0]
                })

                request({
                    url:"seatInfo",
                    type:"get",
                    data:{roomId:res.data[0].roomId}
                }).then(res=>{
   
                    if(res.code===0&&res.data)
                    {
                        this.setState({
                            seats:res.data
                        });
                    }
                }).catch(err=>{
                    message.error("网络错误！请稍后重试...");
                });
                request({
                    url:"filmDetail",
                    type:"get",
                    data:{
                        filmId:res.data[0].filmId
                    }
                }).then(res=>{
                    if(res.code===1)
                    {
                        this.setState({
                            filmDetail:res.data
                        })
                    }
                }).catch(err=>{
                    message.error("网络错误！请稍后重试...");
                })

            }
        }).catch(err=>{
            message.error("网络故障！请稍后重试...");
        });
        //根据场次id查询该场次已订的座位
        request({
            url:"selectedSeat",
            type:"get",
            data:{arrangeId:this.props.location.state.arrangeId}
        }).then(res=>{
            if(res.code==1){
                this.setState({
                    selectedSeat:res.data
                })
            }
        }).catch(err=>{
            message.error("网络故障！请稍后重试...");
        });
    }
 
    componentDidMount(){

        this.init();
    }
    showConfirm() {
        confirm({
          title: '提示信息',
          content: '您还没有登录，登录后才能购票',
          onOk() {
            browserHistory.push('/login');
          },
          onCancel() {
          },
          okText:"去登录",
          cancelText:"关闭"
        });
      }
    //根据查询到的数据加载行与列
    initSeats(){
        const {row,column}=this.state;
        var seats=[];
        for(let i=1;i<=row;i++)
        {
            seats.push(<div className="row">
                {
                    this.getColumn(i,column)
                }
            </div>)
        }

        return seats;
    }
    getColumn(row,column){
        var columns=[];
        for(let i=1;i<=column;i++)
        {
            columns.push(<span title={this.judgeSeat(row,i).result?this.judgeSeat(row,i).data:""} className={this.judgeSeat(row,i).result?(this.selectedSeat(row,i)?"column red":(this.judgeSelect(row,i)?"column green":"column white")):"column"} onClick={e=>this.handelSeatClick(row,i)}></span>)
        }
        return columns;
    }
    //判断座位
    judgeSeat(row,column){
        var data={
            result:false,
            data:""
        };
        const {seats}=this.state;
        if(seats.length>0)
        {
            for(var i of seats)
            {
                if(i.row==row && i.column==column)
                {
                    data={
                        result:true,
                        data:i.seatCode
                    };
                    return data;
                }
            }
        }
        return data;

    }
    //判断是否已经有人订票
    selectedSeat(row,column){
        const {selectedSeat}=this.state;
        if(selectedSeat.length>0)
        {
            for(var i of selectedSeat)
            {
                if(i.row==row && i.column==column)
                {
                    return true;
                }
            }
        }
        return false;
    }
    //判断选中
    judgeSelect(row,column){
        const {selected}=this.state;
        for(var i of selected)
        {
            if(i && i.row==row && i.column==column)
            {
                return true;
            }
        }
        return false;
    }
    //行编号的初始化
    initNumber(){
        let {row}=this.state;
        var lis=[]
        for(let i=1;i<=row;i++)
        {
            lis.push(
                <li>{i}</li>
            )
        }
        return lis;
    }
    //处理座位点击事件
    handelSeatClick(row,column){
        //记录当前选择的row column 
        if(this.selectedSeat(row,column) || this.judgeSelect(row,column)){
            return;
        }
        if(this.state.selected.length>=6)
        {
            message.error("最多只能选择6个座位");
            return ;
        }
        //遍历seats
        for(var i of this.state.seats)
        {
            if(i.column==column && i.row==row)
            {
                var selected=this.state.selected;
                selected.push(i);
                this.setState({
                    selected
                });
                break;
            }
        }
    }
    // getContent(current){
    //     const {roomInfo}=this.state;
    //     if(current==0)
    //     {
    //         return <div className="out-container">
    //         <div className="seat-content">
    //           <div className="header">
    //               屏幕
    //           </div>
    //           <div className="seats">
    //             {
    //                 this.initSeats()
    //             }
    //           </div>
    //           <div className="number">
    //               <ul>
    //                 {this.initNumber()}
    //               </ul>
    //           </div>
    //           <span className="line" style={{height:this.state.row*36+"px"}}>
    //           </span>
    //         </div>
    //         <div className="msg-content">
    //           <div className="film-msg">
    //             <ul>
    //                 <li>
    //                     <span className="lable">电影：</span><span className="msg-span">{this.state.filmDetail.filmName}</span>
    //                 </li>
    //                 <li>
    //                     <span className="lable">日期：</span>
    //                     <span className="msg-span">{
    //                         roomInfo.date+" "
    //                     }</span>
    //                 </li>
    //                 <li>
    //                     <span className="lable">时间：</span>
    //                     <span className="msg-span">{
    //                       roomInfo.start?roomInfo.start.slice(0,5)+"~"+roomInfo.end.slice(0,5):""
    //                     }</span>
    //                 </li>
    //                 <li>
    //                   <span className="lable">票数：</span>
    //                   <span className="msg-span">{this.state.selected.length}</span>
    //                 </li>
    //                 <li>
    //                   <span className="lable">票价：</span>
    //                   <span className="msg-span">{roomInfo.price} 元/张</span>
    //                 </li>
    //                 <li>
    //                 <span className="lable">总价：</span>
    //                   <span className="msg-span">{(roomInfo.price*this.state.selected.length).toFixed(2)} 元</span>
    //                 </li>
    //                 <li>
    //                     <div className="seat-line">
    //                       <span className="lable">座位：</span>
    //                       <div>
    //                           {
    //                               this.state.selected.length>0?this.state.selected.map(value=>{
    //                                   return <span className="seat-code">{value.seatCode}</span>
    //                               }):"未选择座位"
    //                           }
    //                       </div>
    //                     </div>
    //
    //                 </li>
    //                 <li>
    //                     <button className="buy-button" disabled={this.state.selected.length>0?false:true} onClick={this.handleBuy}>确认购买</button>
    //                 </li>
    //                 <li>
    //                     <div className="tip-container">
    //                       <span className="tip-white"></span><span>未售</span>
    //                       <span className="tip-red"></span><span>已售</span>
    //                       <span className="tip-green"></span><span>已选</span>
    //                     </div>
    //                 </li>
    //             </ul>
    //           </div>
    //         </div>
    //       </div>;
    //     }
    //     if(current==1)
    //     {
    //         return <div>
    //             <button onClick={this.pay}>付款</button>
    //         </div>;
    //     }
    //     if(current==3)
    //     {
    //         return <div>
    //             <img src={ok}/>
    //             <p>付款成功,正在跳转您的订单页面...</p>
    //         </div>
    //     }
    // }
    handleBuy(){
        if(!session.get("isLogin"))
        {
            this.showConfirm();
            return;
        }
        //获得服务端的charge参数
        request({
            url:"webCharge",
            type:"post",
            dataType:"json",
            data:{amount:200}
        }).then(res=>{
            console.log(res);
            this.setState({
                charge:res.charge
            });
            this.pay(res.charge);
        }).catch(err=>{
            console.log(err);
        })


        this.setState({
            current:1
        })
    }
    pay(charge){
        var {arrangeId,filmId,roomId}=this.state.roomInfo;
        console.log(this.state.selected);
        var seats=this.state.selected;
        var userInfo=session.get("userInfo");
        var data={};
        data.arrangeId=arrangeId;
        data.userId=userInfo.userId;
        data.filmId=filmId;
        data.roomId=roomId;
        data.seats=seats;
        console.log(data);
        session.set("booking",data);
        pingpp.createPayment(charge, function(result, err){
            if (result == "success") {
                // 只有微信公众账号 (wx_pub)、QQ 公众号 (qpay_pub)、支付宝口碑 (alipay_qr)
                // 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
            } else if (result == "fail") {
                // charge 不正确或者微信公众账号/QQ 公众号/支付宝口碑支付失败时会在此处返回
            } else if (result == "cancel") {
                // 微信公众账号、QQ 公众号、支付宝口碑支付取消支付
            }
        });

        // console.log("pay");
        // request({
        //     url:"pay",
        //     type:"post",
        //     dataType:"json",
        //     data:data
        // }).then(res=>{
        //     console.log(res);
        //     if(res.code==1)
        //     {
        //        this.setState({
        //            current:3
        //        });
        //        setTimeout(function(){
        //         browserHistory.push('/userCenter/2');
        //        },3000);
        //
        //     }
        // }).catch(err=>{
        //     message.error("网络错误!请稍后重试...");
        // })
    }
    render(){
        const {roomInfo}=this.state;
    return (<div>
        <Header path={this.props.location.pathname}></Header>
        <div className="booking-container">
          <div className="steps-content">
              <div className="out-container">
                  <div className="seat-content">
                      <div className="header">
                          屏幕
                      </div>
                      <div className="seats">
                          {
                              this.initSeats()
                          }
                      </div>
                      <div className="number">
                          <ul>
                              {this.initNumber()}
                          </ul>
                      </div>
                      <span className="line" style={{height:this.state.row*36+"px"}}>
              </span>
                  </div>
                  <div className="msg-content">
                      <div className="film-msg">
                          <ul>
                              <li>
                                  <span className="lable">电影：</span><span className="msg-span">{this.state.filmDetail.filmName}</span>
                              </li>
                              <li>
                                  <span className="lable">日期：</span>
                                  <span className="msg-span">{
                                      roomInfo.date+" "
                                  }</span>
                              </li>
                              <li>
                                  <span className="lable">时间：</span>
                                  <span className="msg-span">{
                                      roomInfo.start?roomInfo.start.slice(0,5)+"~"+roomInfo.end.slice(0,5):""
                                  }</span>
                              </li>
                              <li>
                                  <span className="lable">票数：</span>
                                  <span className="msg-span">{this.state.selected.length}</span>
                              </li>
                              <li>
                                  <span className="lable">票价：</span>
                                  <span className="msg-span">{roomInfo.price} 元/张</span>
                              </li>
                              <li>
                                  <span className="lable">总价：</span>
                                  <span className="msg-span">{(roomInfo.price*this.state.selected.length).toFixed(2)} 元</span>
                              </li>
                              <li>
                                  <div className="seat-line">
                                      <span className="lable">座位：</span>
                                      <div>
                                          {
                                              this.state.selected.length>0?this.state.selected.map(value=>{
                                                  return <span className="seat-code">{value.seatCode}</span>
                                              }):"未选择座位"
                                          }
                                      </div>
                                  </div>

                              </li>
                              <li>
                                  <button className="buy-button" disabled={this.state.selected.length>0?false:true} onClick={this.handleBuy}>确认购买</button>
                              </li>
                              <li>
                                  <div className="tip-container">
                                      <span className="tip-white"></span><span>未售</span>
                                      <span className="tip-red"></span><span>已售</span>
                                      <span className="tip-green"></span><span>已选</span>
                                  </div>
                              </li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
        </div>
        <Footer></Footer>
    </div>);
    };


};
BookingPageContainer.propTypes={
    location:React.PropTypes.any,
    query:React.PropTypes.any
}
export default BookingPageContainer;