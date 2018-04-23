import React,{Component} from 'react'; 
import PropTypes from 'prop-types';
class Root extends Component {
    static propTypes={
        dispatch: PropTypes.func,
        
    }

    render(){

        return (
            <div id='root'>
                {this.props.children}
            </div>
        );
    }
}



export default Root;
//rootContainer连接到了store
//连接数据仓库Store