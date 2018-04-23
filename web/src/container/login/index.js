import React from 'react';
import { Link,browserHistory } from 'react-router';
import '../../../static/css/register.css';
import logo from '../../../static/files/img/login/logo.png';
import request from '../../../static/util/request';
import {message} from 'antd';
import {session,local} from '../../../static/util/storage';
class LoginPageContainer extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={    
        };
        this.login=this.login.bind(this);

    };
    login(){
        console.log($("#userName").val());
        console.log($("#pwd").val());
        var userName=$("#userName").val();
        var password=$("#pwd").val();
        if(userName&&password)
        {
            request({
                url:"login",
                type:"post",
                dataType:"json",
                data:{
                    userName,
                    password
                }
            }).then(res=>{
                console.log(res);
                if(res.code===0)
                {
                    message.success("登录成功");
                    session.set("userInfo",res.data.user);
                    session.set("token",res.data.token);
                    session.set("isLogin",true);
                    setTimeout(function(){
                        browserHistory.push('/index');
                    },1000);
                }
                else{
                    message.error("登录失败");
                }
            }).catch(err=>{
                message.error("网络错误！请稍后重试...");
            })
        }
        else{
            message.error("登录错误");
        }

        
    }

    render(){
    return (<div className="back-container">
        <div className="back">
            <div className="form-container login-form-container">
                    <div className="form-header">
                        <img src={logo}/>
                    </div>
                    <input id="userName" type="text" placeholder="用户名"/>
                    <input id="pwd" type="password" placeholder="密码"/>
                    <button type="button" className="login-button" onClick={this.login}>登录</button>
                    <div className="login-footer">
                        <div>   
                            只需要一个账号，您就可以体检极致的观影体验
                        </div>
                        <Link to="/register" className="register">去注册</Link>
                    </div>
            </div>
            <div className="advert-container">
                <div className="icon-container">
                   <img src={require('../../../static/files/img/icon/iconLarge.png')}/>
                </div>
                <div className="advert">
                    <h1>橙子电影</h1>
                    <h1>给您不一样的观影体验</h1>
                </div>
            </div>
        </div>
    </div>);
    };


};

export default LoginPageContainer;