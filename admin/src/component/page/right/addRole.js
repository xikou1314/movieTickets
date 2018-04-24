import React from 'react'
import {message, Button, Form, Input, Checkbox} from 'antd'
import PageContainer from '../../pageBox';
import createBreadCrumb from '../../../assets/util/breadCrumb';
import '../index.less';
import menuData from "../../../menu";
import request from '../../../assets/util/request';
import { browserHistory } from 'react-router';
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;

const createForm = Form.create;
class addRole extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            breadcrumb:[],
            formItemLayout:{            //form表单布局
                labelCol: {
                    span:2

                },
                wrapperCol: {
                    span:7
                },
            },
            formItemLayoutWithOutLabel:{
                wrapperCol: {
                    span:14,
                    offset:2
                },
            },
            operationList:[  { label: '增', value: '1' },
                { label: '删', value: '2' },
                { label: '改', value: '3' },
                { label: '查', value: '4' }
            ],
            modleList:[]
        }
    }
    componentDidMount(){
        this.setState({
            breadcrumb:createBreadCrumb(this.props.location.pathname,menuData)
        })
        this.getModleList();
    }
    getModleList=()=>{
        const {getFieldDecorator}=this.props.form;
        request({
            url:"/modleList",
            type:"get"
        }).then(res=>{
            if(res.code==1 && res.data.length>0)
            {

                this.setState({
                    modleList:res.data
                });
            }
            else{
                message.error("网络故障！请稍后重试...");
            }
        }).catch(err=>{
            message.error("网络故障！请稍后重试...");
        })
    }
    handleReset = () => {
        this.props.form.resetFields();
    }
    isInArray(arr,value){
        for(var i = 0; i < arr.length; i++){
            if(value === arr[i]){
                return 1;
            }
        }
        return 0;
    }
    //跳转到权限列表
    jumpToList=(e) =>{
        browserHistory.push(
            {pathname: '/admin/right/roleList'}
        );
    }
    onSubmit= () => {
        this.props.form.validateFields((err, values) => {
            if(err)
            {
                return;
            }
            console.log(values);
            //构造参数

            var data={};
                data["permission"]=[];
            for(var i in values){
                if(i=="roleName")
                {
                    data[i]=values[i];
                }
                else if(values[i]){
                    console.log("数组");
                    data["permission"].push({
                        modleId:i+"",
                        c:this.isInArray(values[i],"1"),
                        d:this.isInArray(values[i],"2"),
                        u:this.isInArray(values[i],"3"),
                        r:this.isInArray(values[i],"4")
                    });
                }

            }
            request({
                url:"/newRole",
                type:"post",
                dataType:"json",
                data:data
            }).then(res=>{
                if(res.code==0)
                {
                    message.success("角色创建成功");
                    this.jumpToList();
                }
                else{
                    message.error("角色创建失败，请重试...");
                }
            }).catch(err=>{
                message.error("网络错误,请稍后重试...");
            })

        })
    }
    render() {
        const {getFieldDecorator}=this.props.form;
        return (
            <PageContainer title='添加角色' breadcrumb={this.state.breadcrumb}>
                <Form>
                    <FormItem
                        {...this.state.formItemLayout}
                        label={"角色名"}
                    >
                        {getFieldDecorator(`roleName`, {
                            rules: [{
                                required: true,
                                message: "请输入角色名",
                            }],
                        })(
                            <Input placeholder="角色名" />
                        )}
                    </FormItem>
                    {
                        this.state.modleList.map(value=>{
                            return <FormItem
                                {...this.state.formItemLayout}
                                label={value.modleName}
                            >
                                {getFieldDecorator(value.modleId+"", {
                                })(
                                    <CheckboxGroup options={this.state.operationList}>

                                    </CheckboxGroup>
                                )}
                            </FormItem>
                        })
                    }
                    <FormItem {...this.state.formItemLayoutWithOutLabel}>
                        <Button type="primary" htmlType="submit" onClick={this.onSubmit} >创建</Button>
                        <Button style={{ marginLeft: 20 }} onClick={this.handleReset}>
                            重置
                        </Button>
                    </FormItem>
                </Form>
            </PageContainer>
        )
    }
}
addRole=Form.create()(addRole);
export default addRole;
