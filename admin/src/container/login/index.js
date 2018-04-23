import '../../assets/css/login.less';

import React , { Component }from 'react';
import {Form, Input, Button, Checkbox, Spin, message} from 'antd';
import DocumentTitle from 'react-document-title';
import {local,session} from '../../assets/util/storage'; 
import {browserHistory} from 'react-router'
import request from '../../assets/util/request';


import logoImg from '../../assets/img/logo_phone.png';
//表单项
const FormItem = Form.Item;
//create方法用于获取表单的数据
const createForm = Form.create;


class Login extends Component {
		constructor(props)
		{
			super(props);
			this.state={
				loading: false
			};
			this.login = this.login.bind(this);
			this.onKeyPressLogin = this.onKeyPressLogin.bind(this);
		};

	  componentDidMount() {
	



	  };

	  login() {
		//检验当前表单是否验证通过   
        this.props.form.validateFields((err, values) => {
            if (err) return	//未通过 返回

            this.setState({	//通过 设置loading为true
                loading: true
            })

            let loginData = values	//拿到数据
            this.setState({
                loading: false
            });
            return request({
                url: '/login',
                type: 'post',
                dataType: 'json',
                data: loginData
            }).then(res => {
                    this.setState({
                        loading: false
                    })
                    if (res.code === 0) {
                        console.log(res);
                        session.set('isLogin', true)
                        session.set('userInfo', res.data.user) //传入用户信息
                        session.set('token',res.data.token)
                        session.set('role',res.role);
                        session.set('modle',res.modle);
                        // session.set('menuInfo', res.data.menu) //传入菜单信息
                        browserHistory.push('/admin')
                    } else {
                        message.error(res.msg)
                    }

                })
                .catch(err => {

                    message.error(err.statusText)
                    this.setState({
                        loading: false
                    })
                });
        })
    }

    onKeyPressLogin(event) {
        if (event.which === 13) {
            this.login();
        }
        // console.log(event.clientX);
        // console.log('收到表单值：', this.props.form.getFieldsValue());
    }


    render(){
		const {getFieldDecorator} = this.props.form;
        return (
			<div className="login-page">
                <DocumentTitle title="管理台"/>
                <div className="login-box">
                    <img src={logoImg} alt="logo" className="logo"/>
                    <Spin spinning={this.state.loading} size="large">
                        <Form className="login-form" onKeyPress={this.onKeyPressLogin}>
                            <FormItem>
                                {getFieldDecorator('userName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入账户名'
                                        }
                                    ],
                                })(
                                    <Input placeholder="账户"/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入密码'
                                        }
                                    ],
                                })(
                                    <Input autoComplete="off" type="password" placeholder="密码"/>
                                )}
                            </FormItem>
                            <Button type="primary" onClick={this.login}>登录</Button>
                        </Form>
                    </Spin>
                </div>
            </div>
		  );
		
    };
};
Login=createForm()(Login);
export default Login;
  
