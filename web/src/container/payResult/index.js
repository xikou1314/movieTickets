import React from 'react';
import { browserHistory } from 'react-router';
import { message, Modal } from 'antd';
import Header from '../../component/header';
import Footer from '../../component/footer';
import request from '../../../static/util/request';
import {session,local} from '../../../static/util/storage';
import '../../../static/css/payResult.css';
import ok from '../../../static/files/img/booking/ok.png';
import err from '../../../static/files/img/booking/err.png';

const confirm = Modal.confirm;

class PayResult extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            out_trade_no:"",
            result:""
        };

        this.pay=this.pay.bind(this);
    };



    componentDidMount(){

    console.log(this.props);
    var query = this.props.location.query;
    this.setState({
        out_trade_no:query.out_trade_no,
        result:query.result
    });
    }

    pay(){

        var data =  session.get("booking",data);
        console.log(data);

        console.log("pay");
        request({
            url:"pay",
            type:"post",
            dataType:"json",
            data:data
        }).then(res=>{
            console.log(res);
            if(res.code==1)
            {
               setTimeout(function(){
                browserHistory.push('/userCenter/2');
               },3000);
            }
        }).catch(err=>{
            message.error("网络错误!请稍后重试...");
        })
    }
    render(){
        const {roomInfo}=this.state;
        if(this.state.result == "success")
        {
            this.pay();
            return <div>
                <Header path={this.props.location.pathname}></Header>
                <div className={"resultContainer"}>
                    <img src={ok} style={{width:"100px",height:"100px",marginTop:"100px"}}/>
                    <p>付款成功,正在跳转您的订单页面...</p>
                </div>
                <Footer></Footer>
            </div>
        }
        else{
            setTimeout(function(){
                browserHistory.push('/index');
            },3000);
            return (<div>
                <Header path={this.props.location.pathname}></Header>
                <div className={"resultContainer"}>
                    <img src={err} style={{width:"100px",height:"100px",marginTop:"100px"}}/>
                    <p>付款成功,正在跳转首页...</p>
                </div>
                <Footer></Footer>
            </div>);
        }

    };


};
PayResult.propTypes={
    location:React.PropTypes.any,
    query:React.PropTypes.any
}
export default PayResult;