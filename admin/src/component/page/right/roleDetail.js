import React from 'react'
import {message, Button, Form, Input, Checkbox} from 'antd'
import PageContainer from '../../pageBox';
import createBreadCrumb from '../../../assets/util/breadCrumb';
import '../index.less';
import menuData from "../../../menu";
import request from '../../../assets/util/request';
import {browserHistory} from 'react-router';
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;

const createForm = Form.create;
class roleDetail extends React.Component {

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
        this.getRoleDetail();
    }
    getRoleDetail=()=>{
        request({
            url:"/roleDetail",
            type:"get",
            data:{roleId:this.props.location.state.roleId}
        }).then(res=>{
            console.log(res);
            if(res.data)
            {
                let value={};
                if(res.permission)
                {
                    for(var i of res.permission)
                    {
                        value[i.modleId]=this.getNumber(i)
                    }
                }
                value.roleName=res.data.roleName;
                this.props.form.setFieldsValue(value);
            }

        }).catch(err=>{
            message.error("网络错误!请稍后重试...");
        })

    }
    getNumber=(item)=> {
        var param = [];
        if (item.create == 1)
        {
            param.push("1");
        }
        if (item.delete == 1)
        {
            param.push("2");
        }
        if (item.update == 1)
        {
            param.push("3");
        }
        if (item.read == 1)
        {
            param.push("4");
        }
        return param;
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
    back = () => {
        browserHistory.go(-1);

    }
    isInArray(arr,value){
        for(var i = 0; i < arr.length; i++){
            if(value === arr[i]){
                return 1;
            }
        }
        return 0;
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
                    data["permission"].push({
                        modleId:i+"",
                        c:this.isInArray(values[i],"1"),
                        d:this.isInArray(values[i],"2"),
                        u:this.isInArray(values[i],"3"),
                        r:this.isInArray(values[i],"4")
                    });
                }

            }
            data.roleId=this.props.location.state.roleId;
            request({
                url:"/updateRole",
                type:"post",
                dataType:"json",
                data:data
            }).then(res=>{
                if(res.code==1)
                {
                    message.success("角色修改成功");
                }
                else{
                    message.error("角色修改失败，请重试...");
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
                        <Button type="primary" htmlType="submit" onClick={this.onSubmit} >修改</Button>
                        <Button style={{ marginLeft: 20 }} onClick={this.back}>
                            返回
                        </Button>
                    </FormItem>
                </Form>
            </PageContainer>
        )
    }
}
roleDetail=Form.create()(roleDetail);
export default roleDetail;
