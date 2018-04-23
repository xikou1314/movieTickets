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
const FormItem = Form.Item;

const createForm = Form.create;






class NewRoom extends React.Component {

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
            breadcrumb:[]
            

        }
    }

 
    componentDidMount(){
        this.setState({
            breadcrumb:createBreadCrumb(this.props.location.pathname,menuData)
        })
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
              request({
                  url:"/newFilmRoom",
                  type:"post",
                  dataType:"json",
                  data:data
              }).then(res=>{
                  if(res.code===1)
                  {
                      message.success(res.msg);
                  }
              }).catch(err=>{
                  message.error("网络错误！请稍后重试！");
              })
            }
          });

    }
    render() {
       
  
        const {getFieldDecorator} = this.props.form;
        const {formItemLayout,formItemLayoutWithOutLabel,breadcrumb} = this.state;

        return (
            <PageContainer title='添加影厅' breadcrumb={breadcrumb}>
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
                                    initialValue: 5
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
                                    initialValue: 5
                                })(
                                    <Input onChange={this.columnChange} type="number" min="1" step="1" placeholder="请输入列"/>
                                )}
                        </FormItem>
                        <FormItem {...formItemLayoutWithOutLabel}>
                            <Button type="primary" onClick={this.showSeatSet}>设置座位</Button>
                            <Button style={{ marginLeft: 20 }} htmlType="submit">
                            创建
                            </Button>
                            <Button style={{ marginLeft: 20 }}>
                            重置
                            </Button>
                            <Button style={{ marginLeft: 20 }}>
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
NewRoom=createForm()(NewRoom);
export default NewRoom;
