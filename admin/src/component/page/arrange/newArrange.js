import React from 'react'
import {message, Button, Icon, Input, DatePicker,Card,Row,Col,TimePicker,InputNumber} from 'antd'
import PageContainer from '../../pageBox';
import {Spin, Form} from 'antd'
import '../index.less';
import SearchDialog from '../../searchDialog';
import '../../../assets/css/newArrange.less';
import request from '../../../assets/util/request';
import moment from 'moment';
import { browserHistory } from 'react-router';
import $ from 'jquery';
const FormItem = Form.Item;
const {RangePicker } = DatePicker;
const createForm = Form.create;
class newArrange extends React.Component {

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
        showFilmDialog:false,
        selectedData:{},
        filmDetail:{},
        managerItems:[],
        showRoomDialog:false,
        filmSearchParams:[
            {
                type:"text",
                key:"filmName",
                title:"电影名称"
            },
            {
              type:"text",
              key:"director",
              title:"导演"
            },
            {
              type:"text",
              key:"performer",
              title:"演员"
            },
            {
              type:"text",
              key:"filmId",
              title:"电影编号"
            },
          ],
          filmColumns:[
            {title:"名称",dataIndex:"filmName",key:"filmName"},
            {title:"英文名称",dataIndex:"englishName",key:"englishName"},
            {title:"编号",dataIndex:"filmId",key:"filmId"},
        ],
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
        room:[]
        }
    }
    onFilmOk=(data)=>{
      this.setState({
        showFilmDialog:false,
        selectedData:data
      });
      if(data.data)
      {
        this.props.form.setFieldsValue({
            selectFilm: data.data.filmName,
          });
        console.log(data);
        //查询电影详情
        request({
            url:"/filmDetail",
            type:"get",
            data:"filmId="+data.data.filmId
        }).then(res=>{
            if(res.code===0)
            {
                this.setState({
                    filmDetail:res.data
                });
            }
            else{
                message.error("网络错误！请稍后重试...");
            }
        }).catch(err=>{
            message.error("网络错误!请稍后重试...");
        })
      }


    }
    onFilmCancel=()=>{
      this.setState({
        showFilmDialog:false
      });
    }
    onRoomOk=(data)=>{
        this.setState({
            showRoomDialog:false
        });
        var index=this.state.managerIndex;
        var temp={};
        temp['room-'+index]=data.data.roomName;
        this.props.form.setFieldsValue(temp);
        $("#room-"+index).val(data.data.roomName);
        console.log(data);
        var room=this.state.room;
        room[this.state.managerIndex]=data.data;
        this.setState({
            room
        });
        
    }
    onRoomCancel=()=>{
        this.setState({
            showRoomDialog:false
        })
  
    }
    //跳转到场次列表
    jumpToList=(e) =>{
        browserHistory.push(
            {pathname: '/admin/arrange/arrangeList'}
        );
    }
    showRoomDialog=(e)=>{
        this.setState({
            showRoomDialog:true,
            managerIndex:$(e.target).attr("data-id")
        });
        console.log($(e.target).attr("data-id"));
        
    }
    showFilmDialog=()=>{
        this.setState({
            showFilmDialog:true
        })
    }
    add=()=>{
      
        let managerItems=this.state.managerItems;
        const {getFieldDecorator} = this.props.form;
        var length=managerItems.length;
        managerItems.push(
                <FormItem>
                    {getFieldDecorator('room-'+length,{
                        rules:[{
                            required:true,
                            message: '请选择影厅'
                        }]
                    } )(
                    <Input addonAfter={<Icon type="close" data-id={length} className="dynamic-delete-button" onClick={this.delete}></Icon>} data-id={length} onClick={this.showRoomDialog}  type="text" placeholder="请选择电影" />
                    )}
                </FormItem>       
);
        this.setState({
            managerItems:managerItems
        });
    }

    delete=(e)=>{
        var id=$(e.target).attr("data-id");
        let managerItems=this.state.managerItems;
        managerItems[id]=[];
        this.setState({
            managerItems
        });
        this.state.room[id]=[];
    }
    componentDidMount(){
    
    }
    onChange=(time,locale)=>{
        var timeTemp=moment(time);
        var filmTime=this.state.filmDetail.filmTime;
        var hour=filmTime.slice(0,filmTime.indexOf('时'));
        var minutes=filmTime.slice(filmTime.indexOf('时')+1,filmTime.indexOf('分'));
        var timeEnd=timeTemp.add({hours:hour,minutes});
        this.props.form.setFieldsValue({
            end: timeEnd,
          });
      
    }


    handleReset = () => {
        this.props.form.resetFields();
    }
    onSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if(err)
            return;
            values.room=this.state.room;
            var showTime=[
                values.showTime[0].format('YYYY-MM-DD'),
                values.showTime[1].format('YYYY-MM-DD')
            ];
            values.showTime=showTime;
            var start=values.start.format('YYYY-MM-DD HH:mm:ss');
            var end=values.end.format('YYYY-MM-DD HH:mm:ss');

            values.start=start;
            values.end=end;
            values.filmDetail=this.state.filmDetail;
            request({
                url:"/newArrange",
                type:"post",
                data:values,
                dataType:"json"
            }).then(res=>{
                console.log(res);
                if(res.code===0)
                {
                    message.success("创建成功");
                    this.jumpToList();
                }
                else{
                    message.error("网络错误！请稍后重试...");
                }
            }).catch(err=>{
                message.error("网络错误！请稍后重试...");
            })
        });
    }


    render() {
      const {formItemLayout,formItemLayoutWithOutLabel}=this.state;
      const {getFieldDecorator , getFieldValue } = this.props.form;
        return (
            <PageContainer title='新建排片'>
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
                                    <RangePicker allowClear={true}
                                    placeholder={['开始','结束']}
                                    ></RangePicker>
                                )}
                        </FormItem>
                        <FormItem label="选择电影" {...formItemLayout}>
                                {getFieldDecorator('selectFilm', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择电影'
                                        }
                                    ],
                                })(
                                    <Input onClick={this.showFilmDialog} placeholder="请选择电影"/>
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
                                    <TimePicker disabled={this.props.form.getFieldValue("selectFilm")?false:true} format={'HH:mm'}  placeholder="开始时间" onChange={this.onChange}/>
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
                        <Card style={{ width: '80%',marginBottom:"20px" }}>
                            <Row gutter={40}>
                                <Col span={4}>
                                    播放影厅：
                                </Col>
                                <Col span={14} >
                                    {
                                        this.state.managerItems
                                    }
                                    <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                                        <Icon type="plus" /> 添加排片
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                        <FormItem {...formItemLayoutWithOutLabel}>
                            <Button type="primary" htmlType="submit" onClick={this.onSubmit} >创建</Button>
                            <Button style={{ marginLeft: 20 }} onClick={this.handleReset}>
                            重置
                            </Button>
                        </FormItem>
                    </Form>
                    <SearchDialog 
                      visible={this.state.showFilmDialog}
                      title="选择电影"
                      onOk={this.onFilmOk}
                      onCancel={this.onFilmCancel}
                      searchParams={this.state.filmSearchParams}
                      columns={this.state.filmColumns}
                      url='/selectFilm'
                      index="filmId"
                      selectedData={this.state.selectedData}
                    ></SearchDialog>
                    <SearchDialog 
                      visible={this.state.showRoomDialog}
                      title="选择影厅"
                      onOk={this.onRoomOk}
                      onCancel={this.onRoomCancel}
                      searchParams={this.state.roomSearchParams}
                      columns={this.state.roomColumns}
                      url='/roomList'
                      index="roomId"
                      
                    ></SearchDialog>
              </Spin>
            </div>
            </PageContainer>
        )
    }
}
newArrange=createForm()(newArrange);
export default newArrange;
