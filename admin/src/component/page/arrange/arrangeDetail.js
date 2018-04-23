import React from 'react'
import {message, Button, Icon, Input, DatePicker,Card,Row,Col,TimePicker,InputNumber} from 'antd'
import PageContainer from '../../pageBox';
import {Spin, Form} from 'antd'
import '../index.less';
import SearchDialog from '../../searchDialog';
import request from '../../../assets/util/request';
import {browserHistory} from 'react-router';
import moment from 'moment';
import $ from 'jquery';
import menuData from "../../../menu";
import createBreadCrumb from "../../../assets/util/breadCrumb";
import {session} from "../../../assets/util/storage";
import getPermission from "../../../assets/util/getPermission";
const FormItem = Form.Item;
const {RangePicker } = DatePicker;
const createForm = Form.create;
class arrangeDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state={
          formItemLayout:{            //form表单布局
            labelCol: {
                span:2

            },
            wrapperCol: {
                span:6
            },
          },
        formItemLayoutWithOutLabel:{
            wrapperCol: {
                span:14,
                offset:2
              },
        },
        showRoomDialog:false,
        roomSearchParams:[
            {
                type:"text",
                key:"roomName",
                title:"影厅名称"
            },
            {
                type:"text",
                key:"roomId",
                title:"影厅编号"
            },
        ],
        roomColumns:[
            {title:"影厅名称",dataIndex:"roomName",key:"roomName"},
            {title:"影厅编号",dataIndex:"roomId",key:"roomId"},
            {title:"容纳人数",dataIndex:"number",key:"number"}
        ],
        managerIndex:-1,
        room:[],
        detail:{},
        selectedData:{},
        tempData:{}
        }
    }
    onRoomOk=(data)=>{
        this.setState({
            showRoomDialog:false,
            selectedData:data,
            tempData:data
        });
    
        this.props.form.setFieldsValue({
          roomName:data.data.roomName
        })
    }
    onRoomCancel=()=>{
        this.setState({
            showRoomDialog:false
        })
  
    }
    showRoomDialog=(e)=>{
        this.setState({
            showRoomDialog:true,
            managerIndex:$(e.target).attr("data-id")
        });
        console.log($(e.target).attr("data-id"));
        
    }
    init=()=>{
      request({
        url:"/arrangeDetail",
        type:"get",
        data:"arrangeId="+this.props.location.state.arrangeId
      }).then(res=>{
        console.log(res);
        this.props.form.setFieldsValue({
          showTime:moment(res.data.date),
          filmName:res.data.filmName,
          start:moment(res.data.start,"HH:mm:ss"),
          end:moment(res.data.end,"HH:mm:ss"),
          price:res.data.price,
          roomName:res.data.roomName
        });
        this.setState(
          {
            detail:res.data
          }
        );
      }).catch(err=>{
        console.log(err);
      })
    }

    componentWillMount(){
      this.setState({
        breadcrumb:createBreadCrumb(this.props.location.pathname,menuData)
      });
    }
    componentDidMount(){
      this.init();
      var modleName = this.state.breadcrumb[0].text;
      // console.log(this.state.breadcrumb);
      var permission = getPermission (session.get("menuInfo"),modleName);
      this.setState({
        permission
      });
    }
    onChange=(time,locale)=>{
        var timeTemp=moment(time);
        var filmTime=this.state.detail.filmTime;
        var hour=filmTime.slice(0,filmTime.indexOf('时'));
        var minutes=filmTime.slice(filmTime.indexOf('时')+1,filmTime.indexOf('分'));
        var timeEnd=timeTemp.add({hours:hour,minutes});
        this.props.form.setFieldsValue({
            end: timeEnd,
          });
      
    }


    handleReset = () => {
        this.init();
        this.setState({
          tempData:{}
        });
    }
    onSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if(err)
            return;
            console.log(values);
            // arrangeId filmId roomId date start end price
            var data={
              arrangeId:this.props.location.state.arrangeId,
              filmId:this.state.detail.filmId,
              date:values.showTime.format('YYYY-MM-DD'),
              start:values.start.format('YYYY-MM-DD HH:mm:ss'),
              end:values.end.format('YYYY-MM-DD HH:mm:ss'),
              price:values.price
            }
            if(this.state.tempData.roomId)
            {
              data.roomId=this.state.tempData.roomId
            }
            else{
              data.roomID=this.state.detail.roomId
            }
            console.log(data);
            request({
                url:"/updateArrange",
                type:"get",
                data:data,
            }).then(res=>{
                console.log(res);
                if(res.code===0)
                {
                    message.success("修改成功");
                }
                else{
                    message.error("网络错误！请稍后重试...");
                }
            }).catch(err=>{
                message.error("网络错误！请稍后重试...");
            })
        });
    }
    back=()=>{
        browserHistory.push('/admin/arrange/arrangeList');
    }

    render() {
      const {formItemLayout,formItemLayoutWithOutLabel,breadcrumb}=this.state;
      const {getFieldDecorator , getFieldValue } = this.props.form;
        return (
            <PageContainer title='场次详情' breadcrumb={breadcrumb}>
            <div>
              <Spin spinning={false} size="large">
              <Form>
                        <FormItem label="上映日期" {...formItemLayout}>
                                {getFieldDecorator('showTime', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择上映时间'
                                        }
                                    ],
                                })(
                                    <DatePicker allowClear={true}
                                    placeholder={"选择日期"}
                                    ></DatePicker>
                                )}
                        </FormItem>
                        <FormItem label="电影名称" {...formItemLayout}>
                                {getFieldDecorator('filmName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '电影名称'
                                        }
                                    ],
                                })(
                                    <Input disabled={true} placeholder="电影名称"/>
                                )}
                        </FormItem>
                        <FormItem label="开始时间" {...formItemLayout}>
                                {getFieldDecorator('start', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择开始时间'
                                        }
                                    ],
                                })(
                                    <TimePicker format={'HH:mm'}   placeholder="开始时间" onChange={this.onChange}/>
                                )}
                        </FormItem>
                        <FormItem label="结束时间" {...formItemLayout}>
                                {getFieldDecorator('end', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择结束时间'
                                        }
                                    ],
                                })(
                                    <TimePicker disabled={true} format={'HH:mm'}  placeholder="结束时间"/>
                                )}
                        </FormItem>
                        <FormItem label="票价" {...formItemLayout}>
                                {getFieldDecorator('price', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请设置票价'
                                        }
                                    ],
                                })(
                                    <InputNumber style={{width:"50%"}} min={0} step={0.01} defaultValue={0} placeholder="请设置票价" ></InputNumber>
                                   
                                )}
                                 <span>元</span>
                        </FormItem>
                        <FormItem label="影厅" {...formItemLayout}>
                                {getFieldDecorator('roomName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '影厅名称'
                                        }
                                    ],
                                })(
                                    <Input placeholder="影厅名称" onClick={this.showRoomDialog}/>
                                )}
                        </FormItem>
                        <FormItem {...formItemLayoutWithOutLabel}>
                            <Button disabled={ this.state.permission&&this.state.permission.update==1?false:true} type="primary" htmlType="submit" onClick={this.onSubmit} >修改</Button>
                            <Button style={{ marginLeft: 20 }} onClick={this.handleReset}>
                            重置
                            </Button>
                            <Button style={{ marginLeft: 20 }} onClick={this.back}>
                            返回
                            </Button>
                        </FormItem>
                    </Form>
                    <SearchDialog 
                      visible={this.state.showRoomDialog}
                      title="选择影厅"
                      onOk={this.onRoomOk}
                      onCancel={this.onRoomCancel}
                      searchParams={this.state.roomSearchParams}
                      columns={this.state.roomColumns}
                      url='/roomList'
                      index="roomId"
                      selectedData={this.state.selectedData}
                    ></SearchDialog>
              </Spin>
            </div>
            </PageContainer>
        )
    }
}
arrangeDetail=createForm()(arrangeDetail);
export default arrangeDetail;
