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
import '../../../assets/css/filmList.less';
import {session} from "../../../assets/util/storage";
import getPermission from "../../../assets/util/getPermission";

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
class arrangeList extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            breadcrumb:[],
            loading:false,
            columns:[
                {
                    title: '场次编号',
                    dataIndex: 'arrangeId',
                    key: 'arrangeId',
                    render: text => <a href="#">{text}</a>,
                }, 
                {
                    title: '电影名称',
                    dataIndex: 'filmName',
                    key: 'filmName',
                }, 
                {
                    title: '影厅名称',
                    dataIndex: 'roomName',
                    key: 'roomName',
                }, 
                {
                  title: '日期',
                  dataIndex: 'date',
                  key: 'date',
                }, 
                {
                  title: '开始时间',
                  dataIndex: 'start',
                  key: 'start',
                }, 
                {
                  title: '结束时间',
                  dataIndex: 'end',
                  key: 'end',
                }, 
                {
                    title: '操作',
                    key: 'action',
                    render: (record) => (
                        <span>
                        <Button disabled={this.state.permission.delete==1?false:true} type="danger" data-id={record.key} data-name={"场次"+record.arrangeId} onClick={this.handleDelete}>删除</Button>&nbsp;
                        <Button disabled={this.state.permission.read==1?false:true} type="primary" data-id={record.key} onClick={this.jumpToDetail} >查看</Button>&nbsp;
                        </span>
                    ),
                }],
            data:[],
            visible:false,
            deleteMsg:""
        }
    }
    init=() => {
        this.setState({loading:true});
        request({
          url:"/arrangeList",
          type:"get",
          data:""
        }).then(res=>{
          
        if(res.code===1)
        {
          let data=[];
          for(var i of res.data)
          {
              data.push({
                  arrangeId:i.arrangeId,
                  key:i.arrangeId,
                  filmName:i.filmName,
                  roomName:i.roomName,
                  date:i.date,
                  start:i.start,
                  end:i.end
              })
          }
          this.setState({data,loading:false});
        }
        else{
            this.setState({data:[],loading:false});
        }
        }).catch(err=>{
          console.log(err);
        })
        
    }
    handleSearch = (e) => {
        e.preventDefault();
        this.setState({loading:true});
        this.props.form.validateFields((err, values) => {
          console.log('Received values of form: ', values);
          request({
            url:"/arrangeList",
            type:"get",
            data:values
          }).then(res=>{
            console.log(res);
          if(res.code===1)
          {
            let data=[];
            for(var i of res.data)
            {
                data.push({
                    arrangeId:i.arrangeId,
                    key:i.arrangeId,
                    filmName:i.filmName,
                    roomName:i.roomName,
                    date:i.date,
                    start:i.start,
                    end:i.end
                })
            }
            this.setState({data,loading:false});
          }
          else{
              this.setState({data:[],loading:false});
          }
          }).catch(err=>{
            console.log(err);
          })
        });
      }
    handleReset = () => {
    this.props.form.resetFields();
    }
    handleOK= (value) =>{
        console.log(value);
        this.setState({
            visible:false
        })
        request({
            url:`/deleteArrange?arrangeId=${this.state.deleteId}`,
            type:'delete',
            dataType:'json'
        }).then(res=>{
            if(res.code===0)
            {
                message.success(res.msg);
            }
            else{
                message.error(res.msg);
            }
            this.init();
        }).catch(err=>{
            message.error("网络错误！请重试！");
            this.init();
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
    //跳转到详情页面
    jumpToDetail=(e) =>{
        var $element = $(e.target);
        console.log($element.attr("data-id"));
        browserHistory.push(
            {pathname: '/admin/arrange/arrangeDetail',state: { arrangeId: $element.attr("data-id") }}
        );
    }
    componentWillMount(){
        this.setState({
            breadcrumb:createBreadCrumb(this.props.location.pathname,menuData)
        });
    }
    componentDidMount(){
        this.init();
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
            <PageContainer title='排片列表' breadcrumb={breadcrumb} className="container">
                <Form
                        className="ant-advanced-search-form"
                        onSubmit={this.handleSearch}
                    >
                        <Row gutter={40}>
                            <Col
                                span={12}
                            >
                                <FormItem {...formItemLayout} label='电影名称'>
                                    {
                                        getFieldDecorator('filmName')(
                                            <Input placeholder="请输入电影名称" />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col
                                span={12}
                            >
                                <FormItem {...formItemLayout} label='场次编号'>
                                    {
                                        getFieldDecorator('arrangeId')(
                                            <Input placeholder="请输入场次编号" />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col
                                span={12}
                            >
                                <FormItem {...formItemLayout} label='影厅名称'>
                                    {
                                        getFieldDecorator('roomName')(
                                            <Input placeholder="请输入影厅名称" />
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
arrangeList = Form.create()(arrangeList);
export default arrangeList;
