import React from 'react'
import {message, Button, Icon, Form, Row, Col, Input, DatePicker, Table} from 'antd'
import PageContainer from '../../pageBox';
import createBreadCrumb from '../../../assets/util/breadCrumb';
import DeleteDialog from '../../deleteDialog';
import menuData from '../../../menu';
import request from '../../../assets/util/request';
import {browserHistory} from 'react-router'
import $ from 'jquery';
import '../index.less';
import {session} from "../../../assets/util/storage";
import getPermission from "../../../assets/util/getPermission";


const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
class UserList extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            breadcrumb:[],
            loading:false,
            columns:[
                {
                    title: '用户编号',
                    dataIndex: 'userId',
                    key: 'userId',
                    render: text => <a href="#">{text}</a>,
                },
                {
                    title: '用户名',
                    dataIndex: 'userName',
                    key: 'userName',
                },
                {
                    title: '手机号',
                    dataIndex: 'phone',
                    key: 'phone',
                },
                {
                    title: '邮箱',
                    dataIndex: 'email',
                    key: 'email',
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (record) => (
                        <span>
                        <Button disabled={this.state.permission.delete==1?false:true} type="danger" data-id={record.userId} data-name={record.userName} onClick={this.handleDelete}>删除</Button>&nbsp;
                        <Button disabled={this.state.permission.read==1?false:true} type="primary" data-id={record.userId} onClick={this.jumpToDetail} >查看</Button>&nbsp;
                        </span>
                    ),
                }],
            data:[],
            visible:false,
            deleteMsg:""
        }
    }
    handleSearch = (e) => {
        e.preventDefault();
        this.setState({loading:true});
        this.props.form.validateFields((err, values) => {
            console.log(values);
            for(var i in values)
            {
                if(values[i]===undefined)
                    values[i]="";
            }
            if(!err)
            {
                request({
                    url:"/userList",
                    type:"get",
                    data:values
                }).then(res=>{
                    if(res.code==1)
                    {
                        let data=[];
                        for(var i of res.data)
                        {
                            data.push({
                                key:i.userId,
                                userId:i.userId,
                                userName:i.userName,
                                phone:i.phone,
                                email:i.email
                            })
                        }
                        this.setState({
                            data:data,
                            loading:false
                        });
                    }
                    else{
                        this.setState({
                            data:[],
                            loading:false
                        });
                    }
                }).catch(err=>{
                    console.log(err);
                })

            }
        });
    }
    handleReset = () => {
        this.props.form.resetFields();
    }
    handleOK= (value) =>{
        this.setState({
            visible:false
        })
        request({
            url:`/deleteUser?userId=${this.state.deleteId}`,
            type:'delete',
            dataType:'json'
        }).then(res=>{
            if(res.code===0)
            {
                message.success(res.msg);
                this.search();
            }
            else{
                message.error(res.msg);
            }
        }).catch(err=>{
            message.error("网络错误！请重试！");
        })
    }
    handleCancel= (value) => {
        this.setState({
            visible:false
        });
    }
    handleDelete= (e) => {
        var $element = $(e.target);
        this.setState({
            visible:true,
            msg:$element.attr("data-name"),
            deleteId:$element.attr("data-id")
        });
    }
    search=()=>{
        this.setState({loading:true});
        this.props.form.validateFields((err, values) => {
            console.log(values);
            for(var i in values)
            {
                if(values[i]===undefined)
                    values[i]="";
            }
            if(!err)
            {
                request({
                    url:"/userList",
                    type:"get",
                    data:`userName=${values.userName}&userId=${values.userId}`
                }).then(res=>{
                    console.log(res);
                    if(res.code==1)
                    {
                        let data=[];
                        for(var i of res.data)
                        {
                            data.push({
                                key:i.userId,
                                userId:i.userId,
                                userName:i.userName,
                                phone:i.phone,
                                email:i.email
                            })
                        }
                        this.setState({
                            data:data,
                            loading:false
                        });
                    }
                    else{
                        this.setState({
                            data:[],
                            loading:false
                        });
                    }
                }).catch(err=>{
                    console.log(err);
                })

            }
        });
    }
    //跳转到详情页面
    jumpToDetail=(e) =>{
        var $element = $(e.target);
        console.log($element.attr("data-id"));
        browserHistory.push(
            {pathname: '/admin/user/userDetail',state: { userId: $element.attr("data-id") }}
        );
    }
    componentWillMount(){
        this.setState({
            breadcrumb:createBreadCrumb(this.props.location.pathname,menuData)
        });

    }
    componentDidMount(){
        this.search();
        var modleName = this.state.breadcrumb[0].text;
        var permission = getPermission (session.get("menuInfo"),modleName);
        this.setState({
        permission
        });
    }
    render() {
        const {breadcrumb} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 14 },
        };




        return (
            <PageContainer title='用户列表' breadcrumb={breadcrumb} className="container">
                <Form
                    className="ant-advanced-search-form"
                    onSubmit={this.handleSearch}
                >
                    <Row gutter={40} style={{
                        marginTop:20
                    }}>
                        <Col
                            span={12}
                        >
                            <FormItem {...formItemLayout} label='用户名'>
                                {
                                    getFieldDecorator('userName')(
                                        <Input placeholder="请输入用户名" />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col
                            span={12}
                        >
                            <FormItem {...formItemLayout} label='用户编号'>
                                {
                                    getFieldDecorator('userId')(
                                        <Input placeholder="请输入用户编号" />
                                    )
                                }
                            </FormItem>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button type="primary" htmlType="submit">搜索</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                                重置
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <Table
                    style={{
                        marginTop:20
                    }}
                    loading={this.state.loading}
                    locale = {{
                        filterTitle: '筛选',
                        filterConfirm: '确定',
                        filterReset: '重置',
                        emptyText: '暂无数据',
                    }}
                    columns={this.state.columns}
                    dataSource={this.state.data} />
                <DeleteDialog
                    visible={this.state.visible}
                    onOk={this.handleOK}
                    onCancel={this.handleCancel}
                    msg={this.state.msg}
                >

                </DeleteDialog>
            </PageContainer>
        )
    }
}
UserList = Form.create()(UserList);
export default UserList;
