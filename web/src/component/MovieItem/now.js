import React , { Component , PropTypes}from 'react';
import { Link } from 'react-router';
import config from '../../config';
class MoiveItemNow extends Component {
  
    
    componentWillMount(){
    };
    //now组件需要接收 参数 电影编号mid 电影名称mname 图片url 屏幕类型screen 评分score
    render(){
        const {mid,mname,url} = this.props;
        const imgUrl=config.baseUrl+url;
        return (
            <li className="movie-item">
            <div className="movie-item-box">
            <Link to={'/detail/'+mid}>
            <img src={imgUrl} alt='' />
    
                <div className="movie-overlay movie-overlay-bg">
                        <div className="movie-info">
                    
                            <div className="movie-title" title={mname}>{mname}</div>
                        </div>
                </div>
            </Link>
            <Link to={'/detail/'+mid} className="movie-sale">购票</Link>
            </div>
        </li>
        );
    }
};
MoiveItemNow.propTypes={
    mid:PropTypes.number.isRequired,
    mname:PropTypes.string.isRequired,
    url:PropTypes.string.isRequired
}
export default MoiveItemNow;