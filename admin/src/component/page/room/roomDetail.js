import React from 'react';
import {message,Button,Form ,Input, Spin, Row, Col } from 'antd';
import PageContainer from '../../pageBox';
import request from '../../../assets/util/request';
import config from '../../../config/index';
import moment from 'moment';
import {local, session} from '../../../assets/util/storage';
import '../index.less';
import '../../../assets/css/newRoom.less';
import menuData from '../../../menu';
import createBreadCrumb from '../../../assets/util/breadCrumb';
import $ from 'jquery';
import FilmSeatTitle from '../../FilmSeatTitle';
import {browserHistory} from 'react-router';
import getPermission from "../../../assets/util/getPermission";
const FormItem = Form.Item;

const createForm = Form.create;

class RoomDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            formItemLayout:{            //form表单布局
                labelCol: {
                    span:2,
                    offset:4
                },
                wrapperCol: {
                    span:5
                },
              },
            formItemLayoutWithOutLabel:{
                wrapperCol: {
                    span:8,
                    offset:6
                  },
            },
            breadcrumb:[],
            showSeatSet:false,
            seatData:[
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0]
            ],
            row:5,
            column:5,
            breadcrumb:[],
            

        }
    }

    componentWillMount(){
      this.setState({
        breadcrumb:createBreadCrumb(this.props.location.pathname,menuData)
      });
    }
    componentDidMount(){

        this.getRoomInfo();
        var modleName = this.state.breadcrumb[0].text;
        // console.log(this.state.breadcrumb);
        var permission = getPermission (session.get("menuInfo"),modleName);
        this.setState({
          permission
        });

    }
    onOk=(value)=>{
        this.setState({
            showSeatSet:false,
        })
        
       
    }
    onCancel=(value)=>{
        this.setState({
            showSeatSet:false,
            seatData:value
        })
    }
    showSeatSet=()=>{
        this.setState({
            showSeatSet:true
        })
    }
    rowChange=(e)=>{
        var row=Number($(e.target)[0].value);
        var data=this.getData(row,this.state.column);
        this.setState({
            row:row,
            seatData:data
        })
    }
    columnChange=(e)=>{
        var column=Number($(e.target)[0].value);
        var data=this.getData(this.state.row,column);
        this.setState({
            column:column,
            seatData:data
        })
    }
    getData=(row,column)=>{
        let flags=[];
        for(var i=1;i<=row;i++)
        {
          var rowArray=[];
          for(var j=1;j<=column;j++)
          {
            rowArray.push(0);
          }
         flags.push(rowArray);
        }
        return flags;
    }
    //跳转到影厅列表
    jumpToList=(e) =>{
        browserHistory.push(
            {pathname: '/admin/room/roomList'}
        );
    }
    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
              let data=values;
              let seatData=this.state.seatData;
              //座位将数据进行处理
              let seats=[];
              let row=1;
              let column=1;
              let flag=0;
              //取出不为0的座位
              for(var i=0;i<seatData.length;i++)
              {
                    column=1;
                    if(flag===1)
                    {
                        row++;
                        flag=0;
                    }
                  for(var j=0;j<seatData[i].length;j++)
                  {
                      if(seatData[i][j]===1)
                      {
                        seats.push({
                            row:i+1,
                            column:j+1,
                            code:row+"排"+column+"座"
                        });
                        column++;
                        flag=1;
                      }
                  }
              }
              data.seats=seats;
              data.roomId=this.props.location.state.roomId;
              console.log(data);
              request({
                  url:"/updateRoom",
                  type:"post",
                  dataType:"json",
                  data:data
              }).then(res=>{
                  if(res.code===1)
                  {
                      message.success(res.msg);
                      this.jumpToList();
                  }
              }).catch(err=>{
                  message.error("网络错误！请稍后重试！");
              })
            }
          });

    }
    //获得影厅的详细信息
    getRoomInfo=()=>{
      request({
        url:"/roomDetail",
        type:"get",
        data:"roomId="+this.props.location.state.roomId
      }).then(res=>{
        console.log(res);
        if(res.code===0)
        {
            this.setState({
                row:res.data.row,
                column:res.data.column
            });
            this.getSeatInfo();
            this.props.form.setFieldsValue({
                roomName: res.data.roomName,
                number: res.data.number
            })
        }
      }).catch(err=>{
        console.log(err);
      })
    }
    //获得对应影厅的座位信息
    getSeatInfo=()=>{
        request({
            url:"/seatInfo",
            type:"get",
            data:"roomId="+this.props.location.state.roomId
        }).then(res=>{
            console.log(res);
            if(res.code===0)
            {
                let data=this.getData(this.state.row,this.state.column);
                for(var i of res.data)
                {
                    data[i.row-1][i.column-1]=1;
                }
                this.setState({
                    seatData:data
                })
            }
        
        }).catch(err=>{
            console.log(err);
        })
        }

    back=()=>{
        browserHistory.push('/admin/room/roomList');
    }
    render() {
       
  
        const {getFieldDecorator} = this.props.form;
        const {formItemLayout,formItemLayoutWithOutLabel,breadcrumb} = this.state;

        return (
            <PageContainer title='影厅信息' breadcrumb={breadcrumb}>
            <div className="itemContainer">
                <Spin spinning={false} size="large">
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem label="影厅名称" {...formItemLayout}>
                                {getFieldDecorator('roomName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入影厅名称'
                                        }
                                    ],
                                })(
                                    <Input placeholder="影厅名称"/>
                                )}
                        </FormItem>     
                        <FormItem label="可容纳人数" {...formItemLayout}>
                                {getFieldDecorator('number', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入可容纳人数'
                                        }
                                    ],
                                })(
                                    <Input type="number" min="1" step="1" max={this.state.row*this.state.column} placeholder="容纳人数"/>
                                )}
                        </FormItem>
                        <FormItem label="行" {...formItemLayout}>
                                {getFieldDecorator('row', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入行'
                                        }
                                    ],
                                    initialValue: this.state.row
                                })(
                                    <Input onChange={this.rowChange} type="number" min="1" step="1" placeholder="请输入行"/>
                                )}
                        </FormItem>
                        <FormItem label="列" {...formItemLayout}>
                                {getFieldDecorator('column', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入列'
                                        }
                                    ],
                                    initialValue: this.state.column
                                })(
                                    <Input onChange={this.columnChange} type="number" min="1" step="1" placeholder="请输入列"/>
                                )}
                        </FormItem>
                        <FormItem {...formItemLayoutWithOutLabel}>
                            <Button type="primary" onClick={this.showSeatSet}>设置座位</Button>
                            <Button disabled={ this.state.permission&&this.state.permission.update==1?false:true} style={{ marginLeft: 20 }} htmlType="submit">
                            修改
                            </Button>
                            <Button style={{ marginLeft: 20 }} onClick={this.back}>
                            返回
                            </Button>
                        </FormItem>
                    </Form>
                </Spin>
            </div>
            <FilmSeatTitle visible={this.state.showSeatSet}
                onOk={this.onOk}
                onCancel={this.onCancel}
                selectedData={this.state.seatData}
                row={this.state.row}
                column={this.state.column}
            />
            </PageContainer>
        )
    }
}
RoomDetail=createForm()(RoomDetail);
export default RoomDetail;
