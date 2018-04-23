import React from 'react';
import {Modal,Card,Input,Form,Row,Col,Button,Table,Icon,message,Radio} from 'antd';
import request from '../../assets/util/request';
const FormItem=Form.Item;

class SearchDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state={
          title:this.props.title,
          columns:[],
          data:[],
          loading:false,
          selectedData:this.props.selectedData,       //保存选择的内容
          index:this.props.index
        }
    }
    onOk=()=>{
      this.props.onOk(this.state.selectedData);
    }
    onCancel=()=>{
      this.props.onCancel();
    }
    //根据传入的搜索区域的设置 动态加载搜索区域的组件
    /**
     *  type 搜索框的类型
     *  key 搜索框的key值
     *  title 搜索框的标签名
     */
    searchParams=()=>{
      let params=this.props.searchParams;
      const { getFieldDecorator } = this.props.form;
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };
      var areas=[];
      for(var i of params)
      {
        areas.push(
          <Col span={12}>
          <FormItem
            {...formItemLayout}
            label={i.title}
          >
            {
              getFieldDecorator(i.key, {
              
              })(
                <Input type={i.type}/>
              )
            }
          </FormItem>
          </Col>
        );
      }
      return areas;
    }
    componentDidMount(){
      this.searchParams();
      this.initTable();
    }
    onChange=(e)=>{
    
      var index=this.state.index;
  
      let data={};
      data[index]=e.target['data-id'];
      data.data=e.target['data-msg'];
      this.setState({
        selectedData:data
      })
 
    }
    /**columns 通过传入的参数设置columns
     * title 列名称
     * key 键值
     * dataIndex 对应dataSource中的键值 
     */
    initTable=()=>{
      //加工column
      let columns=this.props.columns;
      let index=this.state.index;
      columns.unshift({
        title:"选择",dataIndex:"key",key:"select",render: (text,cord) => <Radio data-id={text} data-msg={cord} checked={this.state.selectedData&&this.state.selectedData[this.state.index]==text?true:false} onChange={this.onChange}></Radio>,
      })
      this.setState({
        columns:this.props.columns,
        loading:true
      });
      //加载初始数据
      request({
        url:this.props.url,
        type:"get",
        data:""
      }).then(res=>{
         this.setState({
           loading:false
         });
         if(res.code===1)
         {
          let data=[];
          for(var i of res.data)
          {
            let dataItem={};
            for(var j of this.props.columns)
            {
              dataItem[j.dataIndex]=i[j.dataIndex];
              dataItem.key=i[index];
            }
            data.push(dataItem);
          }
          this.setState({
            data:data
          })
         }
      }).catch(err=>{
        message.error("网络错误!请稍后重试...");
      })
    }
    onClick=()=>{
      this.setState({
        data:[],
        loading:true
      });
      this.props.form.validateFields((err, values)=>{
        let searchParams={};
        for(var i in values){
          if(values[i])
          {
            searchParams[i]=values[i];
          }
        }
        request({
          url:this.props.url,
          type:"get",
          data:searchParams
        }).then(res=>{
          this.setState({
            loading:false
          });
          console.log(res);
           if(res.code===1)
           {
            let data=[];
            for(var i of res.data)
            {
              let dataItem={};
              for(var j of this.props.columns)
              {
                dataItem[j.dataIndex]=i[j.dataIndex];
                dataItem.key=i.filmId;
              }
              data.push(dataItem);
            }
            this.setState({
              data:data
            })
           }
        }).catch(err=>{
          message.error("网络错误!请稍后重试...");
        })
      })
    }
    handleReset = () => {
      this.props.form.resetFields();
    }
    render() {
      return  <Modal
        title={this.state.title} 
        visible={this.props.visible}
        onOk={this.onOk} onCancel={this.onCancel}
        title={this.state.title}
        width={800}
        okText={"确定"}
        cancelText={"取消"}
        >
          <Card>
            <Row gutter={40}>
              {
                this.searchParams()
              }
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                  <Button type="primary" htmlType="submit" onClick={this.onClick}>搜索</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                  重置
                  </Button>
              </Col>
            </Row>
          </Card>
          <Card 
            bodyStyle={{overflowY:"scroll",height:"200px"}}
          >
            <Table
              columns={this.state.columns}
              dataSource={this.state.data}
              loading={this.state.loading}
            >

            </Table>
          </Card>
        </Modal>
    }
}
SearchDialog = Form.create()(SearchDialog);
export default SearchDialog;
