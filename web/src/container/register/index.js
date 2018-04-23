import React from 'react';
import { Link, browserHistory } from 'react-router';
import '../../../static/css/register.css';
import logo from '../../../static/files/img/login/logo.png';
import request from '../../../static/util/request';
import config from '../../config/index';
import { Spin, message } from 'antd';
class RegisterPageContainer extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            userName:"",
            password:"",
            phone:"",
            showError:false,
            errMsg:"",
            buttonDisable:true,
            captcha:null,
            captchaText:"",
            refresh:true
        };
        this.onSubmit=this.onSubmit.bind(this);
        this.checkUser=this.checkUser.bind(this);
        this.getSvg=this.getSvg.bind(this);
        this.refreshCaptcha=this.refreshCaptcha.bind(this);
    };
    //表单验证
    onSubmit(){
        this.setState({
            showError:false
        })
        var userName=$('#userName').val();
        var pwd=$('#pwd').val();
        var rPwd=$('#rPwd').val();
        var captcha=$('#captcha').val()
        if((/^[a-zA-Z0-9_-]{6,12}$/ ).test(userName))
        {
            if((/^[a-zA-Z0-9]{6,18}$/ ).test(pwd))
            {
                if(pwd==rPwd)
                {
                    console.log("确认密码成功");
                    //发送创建的请求
                    request({
                        url:"newUser",
                        type:"post",
                        dataType:"json",
                        data:{userName:userName,password:pwd,captcha:captcha,isPhone:0}
                    }).then(res=>{
                        if(res.code===0)
                        {
                            message.success("注册成功");
                            setTimeout(function(){
                                browserHistory.push('/login');
                            },1000)
                            
                        }
                        else if(res.code==2){
                            message.error("验证码错误");
                        }else{
                            message.error("注册失败");
                        }
                    }).catch(err=>{
                        message.error("网络错误！请稍后重试...");
                    })

                    
                }
                else{
                    this.setState({
                        showError:true,
                        errMsg:"两次输入的密码请保持一致"
                    }) 
                }
            }
            else{
                this.setState({
                    showError:true,
                    errMsg:"密码由6~18位的英文字母数字组成"
                }) 
            }

        }
        else{        
            this.setState({
                showError:true,
                errMsg:"用户名由6~12位的英文字母数字_-组成"
            })
          
        }
    };
    //检验用户名是否重复
    checkUser(){
        this.setState({
            showError:false,
        })
        var userName=$('#userName').val();
        if(!userName)
        return;
        request({
            url:"checkUser",
            type:"get",
            data:"userName="+userName
        }).then(res=>{
            if(res.code===0)
            {
                this.setState({
                    buttonDisable:false
                })
            }
            else{
                this.setState({
                    showError:true,
                    errMsg:"用户名已存在"
                })
            }
        }).catch(err=>{
            console.log(err);
        })

    }
    getSvg(){
        if(!this.state.captcha)
            return ;
        return this.state.captcha;
    }
    componentDidMount(){

    }
    refreshCaptcha(){
        this.setState({
            refresh:false
        });
        setTimeout(function(){
            this.setState({
                refresh:true
            });
        }.bind(this),300);
    }
    render(){
    return (
    <div className="back-container">
        
        <div className="back">
            
            <div className="form-container">
                    <div className="form-header">
                        <img src={logo}/>
                    </div>
                    <input id="userName" type="text" onBlur={this.checkUser} placeholder="用户名 (6-12位英文字母 数字 _ -)"/>
                    <input id="pwd" type="password" placeholder="密码 (6-18位英文字母 数字)"/>
                    <input id="rPwd" type="password" placeholder="确认密码"/>
                    <input id="captcha" type="text" placeholder="请输入验证码"/>
                    {this.state.refresh?<embed src={config.baseUrl+"/web/getCaptcha"} width="130" height="60"
                                               type="image/svg+xml"
                    />:""}
                    <button onClick={this.refreshCaptcha} style={{display:"inline-block",float:"right",marginTop:"20px",marginRight:"30px"}}>刷新验证码</button>
                    <button disabled={this.state.buttonDisable} type="button" className="register-button" onClick={this.onSubmit}>注册</button>


                    <div className="form-footer">
                        <span>已有账号?</span>
                        <Link className="login" to="/login">去登录</Link>
                    </div>
                    <div className="err-container">
                        <p className="err-msg" style={{visibility:this.state.showError?"visible":"hidden"}}>
                          <i className="warn-icon"></i>  {this.state.errMsg}
                        </p>
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

    </div>
   );
    };


};

export default RegisterPageContainer;