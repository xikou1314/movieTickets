import React , { Component, PropTypes } from 'react';
import {Link,browserHistory} from 'react-router';
import '../../../static/css/header.css';
import user from '../../../static/files/img/header/user.png';
import phone from '../../../static/files/img/header/phone.png';
import link from '../../../static/files/img/header/link.png';
import config from '../../config';
import {Popconfirm} from 'antd';
import {session,local} from '../../../static/util/storage';


class Header extends React.Component {
    constructor(props)
    {
        super(props);
        this.state={
            userInfo:local.get("userInfo"),
            isLogin:local.get('isLogin'), 
            notLogin: <div className="user-info-slide">
                        <Link to="/login">登录</Link><span>/</span>
                        <Link to="/register">注册</Link>
                     </div>,
            logined:   <div className="user-info-slide">
                           <ul>
                               <li><Link to="/userCenter/2">我的订单</Link></li>
                               <li><Link to="/userCenter/1">基本信息</Link></li>
                               <li>
                                   <Popconfirm 
                                   placement="bottom"
                                   title="您确定要退出吗?"
                                   okText="确定"
                                   cancelText="取消"
                                   onConfirm={this.confirm}
                                   >
                                   <Link >退出登录</Link>   
                                   </Popconfirm>
                                </li>
                           </ul>
                        </div>,
            visible:false
        };
        this.onSubmit=this.onSubmit.bind(this);
        this.confirm=this.confirm.bind(this);
    };
    componentDidMount(){

    };
    confirm(){
        local.removeAll();
        browserHistory.push('/index');
    }
    onSubmit(e){
        console.log("触发了");
        var val=$("#search").val();
        browserHistory.replace('/search/'+val);
    }
    render(){
        return (
            <div id="header" className="clear">
            <div className="header-inner">
            <a href="" className="header-logo">
            </a>
            <div className="nav">
                <ul className="navbar  clear">
                    <li><Link to="/index" className={this.props.path=='/index'?"active":""}>首页</Link></li>
                    <li><Link to="/films" className={this.props.path=='/films'?"active":""}>电影</Link></li>
                </ul>
            </div>
            <div className="user-info">
                <div className="user-avatar">
                    <img src={this.state.isLogin?config.baseUrl+this.state.userInfo.avatar:user} alt="" />
                    <span className="caret"></span>
                </div>
                {
                    this.state.isLogin?this.state.logined:this.state.notLogin
                }
            </div>
            <div className="search-form">
                <input id="search" type="search" placeholder="找电影" className="search" maxLength="32" autoComplete="off" />
                <input type="button" className="submit" onClick={this.onSubmit} />
            </div>
            <div className="app-download">
                <a href="#">
                    <div>
                    <img src={phone} alt="" />
                    <span className="app-text">APP下载</span>
                    <span className="caret"></span>
                    </div>
                </a>
                <div className="app-download-slide">
                <img src={link}/>
                <h4>扫码下载</h4>
                <h6>选座更优惠</h6>
                </div>
            </div>


        </div>
        </div>
        );
    }
};
Header.propTypes={
    path:React.PropTypes.any
};
export default Header;