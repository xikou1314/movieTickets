import React from 'react'
import {message, Button, Icon, Form, Row, Col, Input, DatePicker, Table} from 'antd'
import PageContainer from '../../pageBox';
import createBreadCrumb from '../../../assets/util/breadCrumb';
import getPermission from '../../../assets/util/getPermission';
import DeleteDialog from '../../deleteDialog';
import menuData from '../../../menu';
import request from '../../../assets/util/request';
import {browserHistory} from 'react-router'
import $ from 'jquery';
import '../index.less';
import '../../../assets/css/filmList.less';
import {local, session} from '../../../assets/util/storage';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
class FilmList extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            breadcrumb:[],
            loading:false,
            columns:[
                {
                    title: '电影名称',
                    dataIndex: 'filmName',
                    key: 'filmName',
                    render: text => <a href="#">{text}</a>,
                }, 
                {
                    title: '英文名称',
                    dataIndex: 'englishName',
                    key: 'englishName',
                }, 
                {
                    title: '上映时间',
                    dataIndex: 'onTime',
                    key: 'onTime',
                }, 
                {
                    title: '操作',
                    key: 'action',
                    render: (record) => (
                        <span>
                        <Button disabled={this.state.permission.delete==1?false:true} type="danger" data-id={record.key} data-name={record.filmName} onClick={this.handleDelete}>删除</Button>&nbsp;
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
              url:'/filmList',
              type:'post',
              dataType: 'json',
          }).then(res=>{
              console.log(res);
              if(res.code===1)
              {
                let data=[];
                for(var i of res.data)
                {
                    data.push({
                        key:i.filmId,
                        filmName:i.filmName,
                        englishName:i.englishName,
                        onTime:i.onTime.slice(0,10)
                    })
                }
                this.setState({data,loading:false});
              }
              else{
                  this.setState({data:[],loading:false});
              }
          }).catch(err=>{
              message.error("网络错误！请稍后重试");
          });
        
    }
    handleSearch = (e) => {
        e.preventDefault();
        this.setState({loading:true});
        this.props.form.validateFields((err, values) => {
          console.log('Received values of form: ', values);
          let data={};
          if(values.date && values.date[0])
          {
            let DateFrom = values.date[0].format('YYYY-MM-DD');
            let DateTo = values.date[1].format('YYYY-MM-DD');
  
            data.dateFrom=DateFrom;
            data.dateTo=DateTo;
          }

          data.director=values.director;
          data.filmName=values.filmName;
          data.performer=values.performer;
          
          request({
              url:'/filmList',
              type:'post',
              dataType: 'json',
              data: data
          }).then(res=>{
              console.log(res);
              if(res.code===1)
              {
                let data=[];
                for(var i of res.data)
                {
                    data.push({
                        key:i.filmId,
                        filmName:i.filmName,
                        englishName:i.englishName,
                        onTime:i.onTime
                    })
                }
                this.setState({data,loading:false});
              }
              else{
                  this.setState({data:[],loading:false});
              }
          }).catch(err=>{
              message.error("网络错误！请稍后重试");
          });
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
            url:`/deleteFilm?filmId=${this.state.deleteId}`,
            type:'delete',
            dataType:'json'
        }).then(res=>{
            if(res.code===0)
            {
                message.success(res.msg);
                this.init();
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
    //跳转到详情页面
    jumpToDetail=(e) =>{
        var $element = $(e.target);
        console.log($element.attr("data-id"));
        browserHistory.push(
            {pathname: '/admin/film/filmDetail',state: { filmId: $element.attr("data-id") }}
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
            <PageContainer title='电影列表' breadcrumb={breadcrumb} className="container">
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
                                <FormItem {...formItemLayout} label='导演姓名'>
                                    {
                                        getFieldDecorator('director')(
                                            <Input placeholder="请输入导演姓名" />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col
                                span={12}
                            >
                                <FormItem {...formItemLayout} label='演员姓名'>
                                    {
                                        getFieldDecorator('performer')(
                                            <Input placeholder="请输入演员姓名" />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col
                                span={12}
                            >
                                <FormItem {...formItemLayout} label='上映时间'>
                               
                                    {
                                        getFieldDecorator('date')(
                                            <RangePicker placeholder={['开始时间', '结束时间']}/>
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
FilmList = Form.create()(FilmList);
export default FilmList;
