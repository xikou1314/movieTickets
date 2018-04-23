

import '../../../static/css/init.css';
import React,{Component} from 'react'; 



class RootContainer extends Component {
    constructor(props){
        super(props);
    }
    render(){

        return (
            <div className="root">
                {this.props.children}
            </div>
        );
    }
}
RootContainer.propTypes={
    children:React.PropTypes.any
}


export default RootContainer;
