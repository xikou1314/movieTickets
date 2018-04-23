import React from 'react'
import {message, Button, Icon, Form, Input, Checkbox} from 'antd'
import PageContainer from '../../pageBox';
import '../index.less';
import {browserHistory} from 'react-router';
import menuData from "../../../menu";
import request from '../../../assets/util/request';
import createBreadCrumb from "../../../assets/util/breadCrumb";
import {session} from "../../../assets/util/storage";
import getPermission from "../../../assets/util/getPermission";
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;

const createForm = Form.create;
class UserDetail extends React.Component {

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
            roleList:[],
            userInfo:null,
            roleInfo:null
        }
    }
    componentDidMount(){
        this.getRoleList();
        console.log(this.props.location.state.userId);
        this.getUserDetail();

        var modleName = this.state.breadcrumb[0].text;
        // console.log(this.state.breadcrumb);
        var permission = getPermission (session.get("menuInfo"),modleName);
        this.setState({
        permission
        });
    }
    getUserDetail=()=>{
        request({
            url:"/userDetail",
            type:"get",
            data:{userId:this.props.location.state.userId}
        }).then(res=>{
            console.log(res);
            if(res.code==0)
            {
                var roleId=[];
                for(var i of res.role)
                {
                    roleId.push(i.roleId)
                }
                this.props.form.setFieldsValue({
                    userName:res.data.userName,
                    password:res.data.password,
                    name:res.data.name,
                    phone:res.data.phone,
                    email:res.data.email,
                    roleId:roleId
                });
                this.setState({
                    userInfo:res.data,
                    roleInfo:res.role
                })
            }

        }).catch(err=>{
            console.log(err);
        })
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
    handleBack = () => {
        browserHistory.go(-1);
    }
    onSubmit= () => {
        this.props.form.validateFields((err, values) => {
            if(err)
            {
                return;
            }
            values.userId=this.props.location.state.userId;
            request({
                url:"/updateUser",
                type:"post",
                dataType:"json",
                data:values
            }).then(res=>{
                console.log(res);
                if(res.code==1)
                {
                    message.success("修改用户信息成功");
                }
                else{
                    message.error("修改用户信息失败");
                }
            }).catch(err=>{
                message.error("网络错误！请稍后重试...");
            });

        })
    }
    componentWillMount() {
    this.setState({
      breadcrumb: createBreadCrumb(this.props.location.pathname, menuData)
    });
    }
    render() {
        const {getFieldDecorator}=this.props.form;
        const {breadcrumb} = this.state;
        return (
            <PageContainer title='用户详情' breadcrumb={breadcrumb}>
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
                        <Button disabled={this.state.permission&&this.state.permission.update==1?false:true} type="primary" htmlType="submit" onClick={this.onSubmit} >修改</Button>
                        <Button style={{ marginLeft: 20 }} onClick={this.handleBack}>
                            返回
                        </Button>
                    </FormItem>
                </Form>
            </PageContainer>
        )
    }
}
UserDetail=Form.create()(UserDetail);
export default UserDetail;
