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


const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
class RoleList extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            breadcrumb:[],
            loading:false,
            columns:[
                {
                    title: '角色编号',
                    dataIndex: 'roleId',
                    key: 'roleId',
                    render: text => <a href="#">{text}</a>,
                },
                {
                    title: '角色名',
                    dataIndex: 'roleName',
                    key: 'roleName',
                },
                {
                    title: '创建日期',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                },
                {
                    title: '修改日期',
                    dataIndex: 'updatedAt',
                    key: 'updatedAt',
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (record) => (
                        <span>
                        <Button type="danger" data-id={record.roleId} data-name={record.roleName} onClick={this.handleDelete}>删除</Button>&nbsp;
                            <Button type="primary" data-id={record.roleId} onClick={this.jumpToDetail} >查看</Button>&nbsp;
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
                    url:"/roleListParam",
                    type:"get",
                    data:values
                }).then(res=>{
                    if(res.code==1)
                    {
                        let data=[];
                        for(var i of res.data)
                        {
                            data.push({
                                key:i.roleId,
                                roleId:i.roleId,
                                roleName:i.roleName,
                                createdAt:i.createdAt,
                                updatedAt:i.updatedAt
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
            url:`/deleteRole?roleId=${this.state.deleteId}`,
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
            for(var i in values)
            {
                if(values[i]===undefined)
                    values[i]="";
            }
            if(!err)
            {
                request({
                    url:"/roleList",
                    type:"get",

                }).then(res=>{
                    console.log(res);
                    if(res.code==1)
                    {
                        let data=[];
                        for(var i of res.data)
                        {
                            data.push({
                                key:i.roleId,
                                roleId:i.roleId,
                                roleName:i.roleName,
                                createdAt:i.createdAt.slice(0,10),
                                updatedAt:i.updatedAt.slice(0,10)
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
            {pathname: '/admin/right/roleDetail',state: { roleId: $element.attr("data-id") }}
        );
    }
    componentWillMount(){
        this.setState({
            breadcrumb:createBreadCrumb(this.props.location.pathname,menuData)
        });

    }
    componentDidMount(){

        this.search();
    }
    render() {
        const {breadcrumb} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 14 },
        };




        return (
            <PageContainer title='角色列表' breadcrumb={breadcrumb} className="container">
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
                            <FormItem {...formItemLayout} label='角色名'>
                                {
                                    getFieldDecorator('roleName')(
                                        <Input placeholder="请输入角色名" />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col
                            span={12}
                        >
                            <FormItem {...formItemLayout} label='角色编号'>
                                {
                                    getFieldDecorator('roleId')(
                                        <Input placeholder="请输入角色编号" />
                                    )
                                }
                            </FormItem>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button type="primary" htmlType="submit">Search</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                                Clear
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
RoleList = Form.create()(RoleList);
export default RoleList;
