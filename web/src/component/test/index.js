import React,{PropTypes as P} from 'react';//引入react和ProTypes
//ProTypes是用于检查props参数类型，可有可无，最好是有

//根据上一级组件传递的数据和事件进行处理
/*以类的方式创建一个组件*/
class Com extends React.Component {
    constructor(props){
        super(props);
        this.state={

        };
    }
    /* 组件初始化完毕时触发*/
    componentDidMount(){

    }
    /*渲染组件*/
    //调用父组件传递过来的value和onclick
    render(){
        return (
            <div>
                <span>{this.props.value}</span>
                <button onClick={()=>this.props.onClick(this.props.value)}>点击</button>
            </div>
        );
    }
}
/*下面是对该组件中涉及到的prop数据进行类型检查，如果类型不匹配会发出警告*/
Com.propTypes={
    value:React.PropTypes.number,
    onClick:React.PropTypes.func,
};
export default Com;