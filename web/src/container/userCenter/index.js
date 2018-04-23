import React ,{Component}from 'react';
import { Spin,Table,Form,Input,Button,message } from 'antd';
import request from '../../../static/util/request';
import ReactCoreImageUpload  from 'react-core-image-upload';
import config from '../../config';
//导入css样式

import '../../../static/css/userCenter.css';

//导入组件
import Header from '../../component/header';
import Footer from '../../component/footer';

const FormItem = Form.Item;




class UserCenterContainer extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
          load:false,
          currentKey:Number(this.props.params.currentKey),
          src: require('../../../static/files/img/header/user.png'),
          userName:"",
          name:"",
          phone:"",
          email:"",
          userInfo:{},
          columns:[
          {
            title: '电影名称',
            dataIndex: 'filmName',
            key: 'filmName'
          },
          {
            title: '场次',
            dataIndex: 'arrange',
            key: 'arrange'
          },
          {
            title: '影厅',
            dataIndex: 'room',
            key: 'room'
          },
          {
            title: '座位',
            dataIndex: 'seat',
            key: 'seat'
          },
          {
            title: '票价',
            dataIndex: 'price',
            key: 'price'
          },
          {
            title: '状态',
            dataIndex: 'status',
            key: 'status'
          },
          {
            title: '取票码',
            dataIndex: 'ticketCode',
            key: 'ticketCode'

          }

          ],
        data:[],
        formItemLayout:{
          labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 8 },
          }
        },
        tailFormItemLayout:{
          wrapperCol: {
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 14,
              offset: 6,
            },
          }
        }
        
        }
        this.imageuploaded=this.imageuploaded.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.updateUser=this.updateUser.bind(this);
	  };
	componentWillMount(){
   
  
  };
  
  sideClick(key){
    var {currentKey}=this.state;
    if(currentKey==key)
    return;
    else{
      this.setState({
        currentKey:key
      });
    }
 
  }
  userInfo(){
    request({
      url:"userInfo",
      type:"get",
      data:{
        userId:1
      }
    }).then(res=>{
      if(res.code===1)
      {
        this.setState({
          userInfo:res.data[0],
          userName:res.data[0].userName,
          name:res.data[0].name,
          phone:res.data[0].phone,
          email:res.data[0].email,
          src:config.baseUrl+res.data[0].avatar
        });
      }
    }).catch(err=>{
      console.log(err);
    })
  }
  componentDidMount(){
    this.userInfo();
    this.getBookingList();
  }
  imageuploaded(res){
    if (res.code == 0) {
      this.setState({
        src: config.baseUrl+res.filePath
      });
    }
  }
  handleUserName(value){
    this.setState({
      userName:value
    })
  }
  handleName(value){
    this.setState({
      name:value
    })
  }
  handlePhone(value){
    this.setState({
      phone:value
    })
  }
  handleEmail(value){
    this.setState({
      email:value
    })
  }
  handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(values.newPwd!==values.confirm)
        {
          message.error("确认密码需要与新密码保持一致",3);

        }
        else{
            this.setState({
                load:true
            });
          request({
            url:"updatePwd",
            type:"post",
            dataType:"json",
            data:{userId:1,oldPwd:values.oldPwd,newPwd:values.newPwd}
          }).then(res=>{
              this.setState({
                  load:false
              });
            if(res.code==0)
            {
              alert("修改密码成功");
            }
            else{
              alert("修改密码失败");
            }
          }).catch(err=>{
              this.setState({
                  load:false
              });
              message.error("网络错误!请稍后重试...",3);
          })
        }
      }
    });
  }
  updateUser(){
      var data={
        userName:this.state.userName,
        name:this.state.name,
        phone:this.state.phone,
        email:this.state.email,
        avatar:this.state.src.split(config.baseUrl)[1],
        userId:this.state.userInfo.userId
      };
      this.setState({
          load:true
      });
      request({
          url:"updateUser",
          type:"post",
          dataType:"json",
          data:data
      }).then(res=>{
          this.setState({
              load:false
          });
          if(res.code==0)
          {
              alert("修改用户信息成功");
          }
          else{
              alert("修改用户信息失败");
          }
      }).catch(err=>{
          message.error("网络错误!请稍后重试...",3);
      })
  }
  getInfo(){
    const {currentKey}=this.state;
    const { getFieldDecorator } = this.props.form;
    switch(currentKey){
      case 1:
        return <div>
        <div className="avatar-content">
          <div className="avatar-container">
              <img src={this.state.src}/>
          </div>
          <div className="upload-container">
            <ReactCoreImageUpload
            text="修改头像"
            inputOfFile="files"
            className="upload-btn"
            url={config.baseUrl+"/web/uploadAvatar"}  
            imageUploaded={this.imageuploaded}
            crop="local"
            cropBtn={{ok:'保存','cancel':'退出'}}
            > 
            </ReactCoreImageUpload>
          </div>
        </div>
        <div className="info-msg">
          <ul>
            <li>
              <label>姓名</label>
              <input value={this.state.name} onChange={this.handleName}/>
            </li>
            <li>
              <label>手机号</label>
              <input value={this.state.phone} onChange={this.handlePhone}/>
            </li>
            <li>
              <label>邮箱</label>
              <input value={this.state.email} onChange={this.handleEmail}/>
            </li>
          </ul>
        </div>
        <div className="submit-button">
        <button onClick={this.updateUser}>保存</button>
        </div>
      </div>;
      break;
      case 2:
       return <div>
          <Table  pagination={{ pageSize: 6 }} columns={this.state.columns} dataSource={this.state.data}></Table>
       </div>;
       break;
      case 3:
        return <div>
                <Form onSubmit={this.handleSubmit}>
                  <FormItem
                  {...this.state.formItemLayout}
                  label="旧密码"
                  >
                    {getFieldDecorator('oldPwd', {
                      rules: [{ required: true, message: '请输入旧密码' }]
                    })(
                      <Input  type="password" placeholder="请输入旧密码" />
                    )}
                  </FormItem>
                  <FormItem
                  {...this.state.formItemLayout}
                  label="新密码"
                  >
                    {getFieldDecorator('newPwd', {
                      rules: [{ required: true, message: '请输入新密码' }],
                    })(
                      <Input  type="password" placeholder="请输入新密码" />
                    )}
                  </FormItem>
                  <FormItem
                  {...this.state.formItemLayout}
                  label="确认密码"
                  >
                    {getFieldDecorator('confirm', {
                      rules: [{ required: true, message: '请再次输入新密码' }],
                    })(
                      <Input  type="password" placeholder="请再次输入新密码" />
                    )}
                  </FormItem>
                  <FormItem {...this.state.tailFormItemLayout}>
                    <Button style={{backgroundColor:"red",borderColor:"red"}} type="primary" htmlType="submit" size="large">修改密码</Button>
                  </FormItem>

              </Form>
        </div>;
        break;

    }
  }
  //获得用户的订单信息
  getBookingList(){
      this.setState({
          load:true
      });
    request({
      url:"bookingList",
      type:"get",
      data:{
        userId:1
      }
    }).then(res=>{
        this.setState({
            load:false
        });
      if(res.code===1){
        var data=[];
        for(var i of res.data){
          data.push({
              key: i.id,
              filmName: i.filmName,
              arrange: i.date+"/"+i.start.slice(0,5)+"~"+i.end.slice(0,5),
              room: i.roomName,
              seat: i.seatCode,
              price: i.price,
              status: i.status,
              ticketCode:i.ticketCode
            })
        }
        this.setState({
          data
        });
      }
    }).catch(err=>{
        this.setState({
            load:false
        });
    })
  }
    render(){
   
    return (
    <Spin spinning={this.state.load}>
        <Header path={this.props.location.pathname}>
        </Header>
        <div className="info-container">
          <div className="content">
            <div className="side-bar">
              <h1>个人中心</h1>
              <ul>
                <li className={this.state.currentKey==1?"user-side-active":""} onClick={e=>this.sideClick(1)}>基本信息</li>
                <li className={this.state.currentKey==2?"user-side-active":""} onClick={e=>this.sideClick(2)}>用户订单</li>
                <li className={this.state.currentKey==3?"user-side-active":""} onClick={e=>this.sideClick(3)}>修改密码</li>
              </ul>
            </div>
            <div className="info">
              <h1>{this.state.currentKey==1?"基本信息":(this.state.currentKey==2?"用户订单":"修改密码")}</h1>
              {this.getInfo()}
            </div>
          </div>
        </div>
        <Footer></Footer>
    </Spin>
    );
    };
};
UserCenterContainer.propTypes={
  location:React.PropTypes.any,
  form:React.PropTypes.any,
  params:React.PropTypes.any
}
UserCenterContainer=Form.create()(UserCenterContainer);
export default UserCenterContainer;