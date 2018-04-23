import { Table, Button, Popconfirm,Upload,message,Icon } from 'antd';
import React from 'react';
import EditableCell from '../EditableCell';
import './style.less';
import request from '../../assets/util/request';
import {session} from "../../assets/util/storage";
import config from "../../config";
class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '标题',
            dataIndex: 'title',
            width: '30%',
            render: (text, record, index) => (
                <EditableCell
                    value={text}
                    onChange={this.onCellChange(index, 'title')}
                />
            ),
        }, {
            title: '跳转连接',
            dataIndex: 'href',
            width: '30%',
            render: (text, record, index) => (
                <EditableCell
                    value={text}
                    onChange={this.onCellChange(index, 'href')}
                />
            ),
        }, {
            title: '图片',
            dataIndex: 'imgUrl',
            width:"20%",
            render:(text,record,index) =>{
                return   text==""?<Upload
                    name="carousel"
                    action={config.baseUrl+'/api/carousel'}
                    showUploadList={false}
                    beforeUpload={this.beforeUpload}
                    onChange={info=>this.handleChange(info,index)}
                    headers={{
                        Authorization:"Bearer "+session.get('token')
                    }}
                >
                    <Button>
                        <Icon type="upload" /> 上传图片
                    </Button>
                </Upload>:<span>{text}</span>
            }
        }, {
            title: '操作',
            render: (text, record, index) => {
                return (
                    this.state.isEdit[index]==1?<div><a onClick={e=>this.onSave(index)}>保存&nbsp;</a><a onClick={e=>this.onCancel(index)}>&nbsp;取消</a></div>:this.state.dataSource.length > 1 ?
                        (
                            <Popconfirm title="确定要删除吗?" okText="确定" cancelText="取消" onConfirm={() => this.onDelete(index)}>
                                <a href="#">删除</a>
                            </Popconfirm>
                        ) : null
                );
            },
        }];
        this.state = {
            count: 0,
            isEdit:[],
            dataSource:[],
            new:-1,
            ids:[] //保存所有项的id
        };
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
    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);

    }
    handleChange = (info,index) => {
        const { dataSource,isEdit } = this.state;
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            // this.getBase64(info.file.originFileObj, imageUrl => this.setState({ imageUrl }));
            // this.setState({filmImgUrl:info.file.response.filePath})
            console.log(info);
            dataSource[index].imgUrl=info.file.response.filePath;
            isEdit[index]=1;
            this.setState({
                dataSource,
                isEdit
            });

        }

    }
    onSave=(index)=>{
        var ids=[...this.state.ids];
        var isEdit=this.state.isEdit;
        isEdit[index]=0;
        if(this.state.new==index)
        {
            console.log("新创建得")
            console.log(this.state.dataSource[index]);
            request({
                url:"/newCarousel",
                type:"post",
                dataType:"json",
                data:this.state.dataSource[index]
            }).then(res=>{
                if(res.code==1)
                {
                    message.success("新建轮播成功");
                    console.log(res);
                    ids.push(res.carouselId);
                    this.setState({ids,new:-1});

                }
                else{
                    message.error("创建轮播图失败");
                }
            }).catch(err=>{
                message.error("网络错误!请稍后重试...");
            })
        }
        else{
            console.log("旧得");
            let data = JSON.parse(JSON.stringify(this.state.dataSource[index]));
            data.carouselId=this.state.ids[index];
            request({
                url:"/updateCarousel",
                type:"post",
                dataType:"json",
                data:data
            }).then(res=>{
               if(res.code==1)
               {
                   message.success("修改轮播图成功");
               }
               else{
                    message.error("修改轮播图失败");
               }
            }).catch(err=>{
                message.error("网络错误!请稍后重试...");
            })
        }
        this.setState({
            isEdit
        });
    }
    onCancel=(index)=>{
        var isEdit=this.state.isEdit;
        isEdit[index]=0;
        this.setState({
            isEdit
        });
    }
    getCarousel=()=>{
        request({
            url:"/carouselList",
            type:"get"
        }).then(res=>{
            console.log(res);
            if(res.code==1&&res.data.length>0){
                var data=[];
                var ids=[];
                for(var i of res.data){
                    data.push({
                        title:i.title,
                        href:i.href,
                        imgUrl:i.imgUrl
                    })
                    ids.push(i.id);
                }
                this.setState({
                    dataSource:data,
                    count:res.data.length,
                    ids
                });
            }
            else{
                message.error("网络故障！请稍后重试...");
            }
        }).catch(err=>{
            message.error("网络故障！请稍后重试...");
        })
    }
    onCellChange = (index, key) => {
        console.log(index,key);

        return (value) => {
            const dataSource = [...this.state.dataSource];
            var isEdit=this.state.isEdit;
            isEdit[index]=1;
            dataSource[index][key] = value;
            this.setState({ dataSource,isEdit });
        };
    }
    onDelete = (index) => {
        console.log(index);
        console.log(ids);
        const dataSource = [...this.state.dataSource];
        const ids=[...this.state.ids];
        var id=ids[index];
        ids.splice(index,1);
        dataSource.splice(index, 1);
        this.setState({ dataSource,ids });
        console.log(ids);
        request({
            url:`/deleteCarousel?carouselId=${id}`,
            type:"delete"
        }).then(res=>{
            console.log(res);
            if(res.code==1)
            {
                message.success("删除轮播成功");
            }
            else{
                message.error("删除轮播失败");
            }
        }).catch(err=>{
            message.error("网络错误!请稍后重试...");
        })
    }
    handleAdd = () => {
        const { count, dataSource } = this.state;
        var length=dataSource.length;
        const newData = {
            title: "",
            href: "",
            imgUrl: ""
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
            new:length
        });
    }
    componentDidMount(){
        this.getCarousel();
    }
    render() {
        const { dataSource } = this.state;
        const columns = this.columns;
        return (
            <div>
                <Button className="editable-add-btn" onClick={this.handleAdd}>添加轮播图</Button>
                <Table bordered dataSource={dataSource} columns={columns} />
            </div>
        );
    }
}
export default EditableTable;
