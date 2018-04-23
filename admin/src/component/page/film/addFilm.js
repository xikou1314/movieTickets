import React from 'react';
import {message, Checkbox, Button, Icon, Form ,Input, Spin, TimePicker, Upload, DatePicker} from 'antd';
import PageContainer from '../../pageBox';
import request from '../../../assets/util/request';
import config from '../../../config/index';
import moment from 'moment';
import {local, session} from '../../../assets/util/storage';
import '../index.less';
import '../../../assets/css/addFilm.less';
import menuData from '../../../menu';
import createBreadCrumb from '../../../assets/util/breadCrumb';
import {browserHistory} from 'react-router'
const FormItem = Form.Item;

const createForm = Form.create;

const CheckboxGroup = Checkbox.Group;

const { TextArea } = Input;


class AddFilm extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            name:'你的名字',
            filmClass:[],               //电影类型
            filmArea:[],                //电影区域
            directorId:1,               //导演输入框的编号
            performerId:1,              //演员输入框的编号
            filmImgUrl:"",              //海报图片的url
            formItemLayout:{            //form表单布局
                labelCol: {
                    span:2

                },
                wrapperCol: {
                    span:14
                },
              },
            formItemLayoutWithOutLabel:{
                wrapperCol: {
                    span:14,
                    offset:2
                  },
            },
            breadcrumb:[]
            

        }
    }

    //获得电影类型的初始化信息
    getFilmClass(){
        request({
            url: '/getFilmClass',
            type: 'get',
            dataType: 'json'
        }).then(res=>{
            if(res.code===1)
            {
                var filmClass=[];
                for(var i of res.data)
                {
                    filmClass.push({
                        label:i.className,
                        value:i.classId
                    });
                }
                this.setState({filmClass});
            }
            
        }).catch(err=>{
            message.error(err.statusText);
        })
    }
    getFilmArea(){
        request({
            url: '/getFilmArea',
            type: 'get',
            dataType: 'json'
        }).then(res=>{
            if(res.code===1)
            {
                var filmArea=[];
                for(var i of res.data)
                {
                    filmArea.push({
                        label:i.areaName,
                        value:i.areaId
                    });
                }
                this.setState({filmArea});
            }
            
        }).catch(err=>{
            message.error(err.statusText);
        })
    }
    componentDidMount(){
        this.getFilmClass();
        this.getFilmArea();
        this.setState({
            breadcrumb:createBreadCrumb(this.props.location.pathname,menuData)
        })
    }
    //跳转到电影列表
    jumpToList=(e) =>{
        browserHistory.push(
            {pathname: '/admin/film/filmList'}
        );
    }
    onSubmit=()=>{
        this.props.form.validateFields((err, values) => {
            let data = JSON.parse(JSON.stringify(values));
            data.filmImgUrl=this.state.filmImgUrl;

            let directors=[];
            let performers=[];
            //处理导演和演员，取出名字作为一个数组传上去
            for(var i of data.directors)
            {
                directors.push(data["director-"+i]);
            }
            data.directors=directors;
            for(var i of data.performers)
            {
                performers.push(data["performer-"+i]);
            }
            data.performers=performers;
            var filmMoment=moment(data.filmTime);
            var timeArray=filmMoment.toArray();
            data.filmTime=timeArray[3]+"时"+timeArray[4]+"分";
            request({
                url: '/newFilm',
                type: 'post',
                dataType: 'json',
                data: data
            }).then(res=>{
                if(res.code===1)
                {
                    message.success(res.msg,0.5);
                    this.jumpToList();
                }
            }).catch(err=>{
                message.error(err.statusText);
            })
        })
    }
    handleReset = () => {
        this.props.form.resetFields();
    }
    //增加按钮
    addDirector = () => {
        var directorId=this.state.directorId;
        directorId++;
        const { form } = this.props;
        // can use data-binding to get
        const directors = form.getFieldValue('directors');
        const nextDirectors = directors.concat(directorId);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            directors: nextDirectors,
        });
        this.setState({directorId});
      }
    //移除按钮
    removeDirector = (k) => {
            const { form } = this.props;
            // can use data-binding to get
            const directors = form.getFieldValue('directors');
            // We need at least one passenger
            if (directors.length === 1) {
            return;
        }

        // can use data-binding to set
        form.setFieldsValue({
            directors: directors.filter(director => director !== k),
        });
    }
    //初始化导演
    initDirector = () => {
        let {getFieldDecorator , getFieldValue } = this.props.form;
        let {formItemLayout,formItemLayoutWithOutLabel} = this.state;
        getFieldDecorator('directors', { initialValue: [1] });
        let directors = getFieldValue('directors');

        let directorItems = directors.map((k, index) => {
             
            return (
              <FormItem
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                label={index === 0 ? '导演' : ''}
                required={true}
                key={k}
              >
                {getFieldDecorator(`director-${k}`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: "请输入导演的名字",
                  }],
                })(
                  <Input placeholder="导演" style={{ width: '60%', marginRight: 8 }} />
                )}
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  disabled={directors.length === 1}
                  onClick={() => this.removeDirector(k)}
                />
              </FormItem>
            );
          });
          
        return directorItems;
        
    }
    //添加演员
    addPerformer = () =>{
        var performerId=this.state.performerId;
        performerId++;
        const { form } = this.props;
        // can use data-binding to get
        const performers = form.getFieldValue('performers');
        const nextPerformers = performers.concat(performerId);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            performers: nextPerformers,
        });
        this.setState({performerId});
    }
    //移除演员
    removePerformer = (k) =>{
        const { form } = this.props;
        // can use data-binding to get
        const performers = form.getFieldValue('performers');
        // We need at least one passenger
        if (performers.length === 1) {
        return;
        }

        // can use data-binding to set
        form.setFieldsValue({
            performers: performers.filter(performer => performer !== k),
        });
    }
    //初始化演员
    initPerformer = () => {
        let {getFieldDecorator , getFieldValue } = this.props.form;
        let {formItemLayout,formItemLayoutWithOutLabel} = this.state;
        getFieldDecorator('performers', { initialValue: [1] });
        let performers = getFieldValue('performers');

        let performerItems = performers.map((k, index) => {
             
            return (
              <FormItem
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                label={index === 0 ? '演员' : ''}
                required={true}
                key={k}
              >
                {getFieldDecorator(`performer-${k}`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: "请输入演员的名字",
                  }],
                })(
                  <Input placeholder="演员" style={{ width: '60%', marginRight: 8 }} />
                )}
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  disabled={performers.length === 1}
                  onClick={() => this.removePerformer(k)}
                />
              </FormItem>
            );
          });
          
        return performerItems;
    }

    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
        
      }
    beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
          message.error('You can only upload JPG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('Image must smaller than 2MB!');
        }
        return isJPG && isLt2M;
      }
    handleChange = (info) => {
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          this.getBase64(info.file.originFileObj, imageUrl => this.setState({ imageUrl }));
          this.setState({filmImgUrl:info.file.response.filePath})
        }
        
      }
    
    render() {
        // var breadcrumb=[
        //     {path:'/home',text:'Home'},
        //     {path:'/home/addFilm',text:'电影添加'}
        // ];
        const {getFieldDecorator , getFieldValue } = this.props.form;
        const {formItemLayout,formItemLayoutWithOutLabel,breadcrumb} = this.state;
          
        const directorItems = this.initDirector();
        const performerItems = this.initPerformer();

        const imageUrl = this.state.imageUrl;


        return (
            <PageContainer title='电影添加' breadcrumb={breadcrumb}>
            <div className="itemContainer">
                <Spin spinning={false} size="large">
                    <Form>
                        <FormItem label="电影名称" {...formItemLayout}>
                                {getFieldDecorator('filmName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入电影名称'
                                        }
                                    ],
                                })(
                                    <Input placeholder="电影名称"/>
                                )}
                        </FormItem>
                        <FormItem label="英文名称" {...formItemLayout}>
                                {getFieldDecorator('englishName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入英文名称'
                                        }
                                    ],
                                })(
                                    <Input placeholder="英文名称"/>
                                )}
                        </FormItem>
                        <FormItem label="电影类型" {...formItemLayout}>
                                {getFieldDecorator('filmClass', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择电影类型'
                                        }
                                    ],
                                })(
                                    <CheckboxGroup options={this.state.filmClass} />
                                )}
                        </FormItem>
                        <FormItem label="电影区域" {...formItemLayout}>
                                {getFieldDecorator('filmArea', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择电影区域'
                                        }
                                    ],
                                })(
                                    <CheckboxGroup options={this.state.filmArea} />
                                )}
                        </FormItem>
                        {directorItems}
                        <FormItem {...formItemLayoutWithOutLabel}>
                            <Button type="dashed" onClick={this.addDirector} style={{ width: '30%' }}>
                                <Icon type="plus" />添加导演
                            </Button>
                        </FormItem>
                        {performerItems}
                        <FormItem {...formItemLayoutWithOutLabel}>
                            <Button type="dashed" onClick={this.addPerformer} style={{ width: '30%' }}>
                                <Icon type="plus" />添加演员
                            </Button>
                        </FormItem>
                        <FormItem label="简介" {...formItemLayout}>
                                {getFieldDecorator('introduction', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入电影简介'
                                        }
                                    ],
                                })(
                                    <TextArea rows="5" placeholder="请输入电影简介">
                                    
                                    </TextArea>
                                )}
                        </FormItem>
                        <FormItem label="上映时间" {...formItemLayout}>
                                {getFieldDecorator('onTime', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入上映时间'
                                        }
                                    ],
                                })(
                                    
                                    <DatePicker placeholder="请选择时间"/>
                                    
                                )}
                        </FormItem>
                        <FormItem label="电影时长" {...formItemLayout}>
                                {getFieldDecorator('filmTime', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入电影时长'
                                        }
                                    ],
                                })(
                                    
                                    <TimePicker defaultValue={moment('00:00', 'HH:mm')} placeholder="请选择时间" format="HH:mm"/>
                                    
                                )}
                        </FormItem>
                        <FormItem label="海报" {...formItemLayout}>
                              
                                <Upload
                                    className="avatar-uploader"
                                    name="avatar"
                                    showUploadList={false}
                                    action={config.baseUrl+'/api/upload'}
                                    beforeUpload={this.beforeUpload}
                                    onChange={this.handleChange}
                                    headers={{
                                        Authorization:"Bearer "+session.get('token')
                                    }}
                                >
                                    {
                                        imageUrl ?
                                        <img src={imageUrl} alt="" className="avatar" /> :
                                        <Icon type="plus" className="avatar-uploader-trigger" />
                                    }
                                </Upload>
                                
                        </FormItem>
                        <FormItem {...formItemLayoutWithOutLabel}>
                            <Button type="primary" htmlType="submit" onClick={this.onSubmit} >创建</Button>
                            <Button style={{ marginLeft: 20 }} onClick={this.handleReset}>
                            重置
                            </Button>
                        </FormItem>
                    </Form>
                </Spin>
            </div>
            </PageContainer>
        )
    }
}
AddFilm=createForm()(AddFilm);
export default AddFilm;
