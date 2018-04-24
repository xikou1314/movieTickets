import React from 'react'
import {message, Button, Icon, Form, Input, Checkbox} from 'antd'
import PageContainer from '../../pageBox';
import createBreadCrumb from '../../../assets/util/breadCrumb';
import '../index.less';
import menuData from "../../../menu";
import request from '../../../assets/util/request';
import { browserHistory } from 'react-router';
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;

const createForm = Form.create;
class addUser extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            breadcrumb:[],
            formItemLayout:{            //form表单布局
                labelCol: {
                    span:2

                },
                wrapperCol: {
                    span:7
                },
            },
            formItemLayoutWithOutLabel:{
                wrapperCol: {
                    span:14,
                    offset:2
                },
            },
            roleList:[]
        }
    }
    componentDidMount(){
        this.setState({
            breadcrumb:createBreadCrumb(this.props.location.pathname,menuData)
        })
        this.getRoleList();
    }
    getRoleList=()=>{
        var roleList=[];
        request({
            url:"/roleList",
            type:"get"
        }).then(res=>{
            if(res.code==1 && res.data.length>0)
            {
                for(var i of res.data)
                {
                    roleList.push({
                        label:i.roleName,
                        value:i.roleId
                    })
                }
                this.setState({
                    roleList:roleList
                });
            }
        }).catch(err=>{
            message.error("网络故障！请稍后重试...");
        })
    }
    handleReset = () => {
        this.props.form.resetFields();
    }
    //跳转到用户列表
    jumpToList=(e) =>{
        browserHistory.push(
            {pathname: '/admin/user/userList'}
        );
    }
    onSubmit= () => {
        this.props.form.validateFields((err, values) => {
            if(err)
            {
               return;
            }
            console.log(values);
            request({
                url:"/newUser",
                type:"post",
                dataType:"json",
                data:values
            }).then(res=>{
                console.log(res);
                if(res.code==0)
                {
                    message.success("用户创建成功");
                    this.jumpToList();
                }
                else{
                    message.error("用户创建失败，请重试...");
                }
            }).catch(err=>{
                    message.error("网络错误,请稍后重试...");
            })

        })
    }
    render() {
        const {getFieldDecorator}=this.props.form;
        return (
            <PageContainer title='添加用户' breadcrumb={this.state.breadcrumb}>
                <Form>
                    <FormItem
                        {...this.state.formItemLayout}
                        label={"用户名"}
                    >
                        {getFieldDecorator(`userName`, {
                            rules: [{
                                required: true,
                                message: "请输入用户名",
                            }],
                        })(
                            <Input placeholder="用户名" />
                        )}
                    </FormItem>
                    <FormItem
                        {...this.state.formItemLayout}
                        label={"密码"}
                    >
                        {getFieldDecorator(`password`, {
                            rules: [{
                                required: true,
                                message: "请输入密码",
                            }],
                        })(
                            <Input placeholder="密码" type={"password"}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...this.state.formItemLayout}
                        label={"真实姓名"}
                    >
                        {getFieldDecorator(`name`, {
                            rules: [{
                                required: true,
                                message: "请输入真实姓名",
                            }],
                        })(
                            <Input placeholder="真实姓名" />
                        )}
                    </FormItem>
                    <FormItem
                        {...this.state.formItemLayout}
                        label={"手机号"}
                    >
                        {getFieldDecorator(`phone`, {
                            rules: [{
                                required: true,
                                message: "请输入手机号",
                            }],
                        })(
                            <Input placeholder="手机号" />
                        )}
                    </FormItem>
                    <FormItem
                        {...this.state.formItemLayout}
                        label={"邮箱"}
                    >
                        {getFieldDecorator(`email`, {
                            rules: [{
                                required: true,
                                message: "请输入邮箱",
                            }],
                        })(
                            <Input placeholder="邮箱" />
                        )}
                    </FormItem>
                    <FormItem
                        {...this.state.formItemLayout}
                        label={"权限"}
                    >
                        {getFieldDecorator(`roleId`, {
                            rules: [{
                                required: true,
                                message: "请选择权限",
                            }],
                        })(
                            <CheckboxGroup options={this.state.roleList}>

                            </CheckboxGroup>
                        )}
                    </FormItem>
                    <FormItem {...this.state.formItemLayoutWithOutLabel}>
                        <Button type="primary" htmlType="submit" onClick={this.onSubmit} >创建</Button>
                        <Button style={{ marginLeft: 20 }} onClick={this.handleReset}>
                            重置
                        </Button>
                    </FormItem>
                </Form>
            </PageContainer>
        )
    }
}
addUser=Form.create()(addUser);
export default addUser;
