import React , { Component ,PropTypes}from 'react';
import img from '../../../static/files/img/index/movies/rank1.jpg';
class TicketsTop extends Component{
    //拿到票房的排名数据 对数据进行处理
  

    componentDidMount(){

    };
    render(){
        var {mid,mname,url,tickets}=this.props;

        return (<li className="clear ranking-item-border ranking-item">
        <a href="#">
            <div className="ranking-top-left">
                <span className="ranking-top-icon"></span>
                <img src={require('../../../static/files/'+url)} alt=""/>
            </div>
            <div className="ranking-top-right">

                    <span className="ranking-top-movie-name">{mname}</span>
                    <p className="ranking-top-wish">
                        <span>{(tickets/10000).toFixed(2)}</span>万
                    </p>


            </div>
        </a>

    </li>);
    };

};
TicketsTop.propTypes={
    mid:PropTypes.number.isRequired,
    mname:PropTypes.string.isRequired,
    url:PropTypes.string.isRequired,
    tickets:PropTypes.string.isRequired

}
export default TicketsTop;