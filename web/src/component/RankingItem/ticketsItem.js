import React , { Component ,PropTypes}from 'react';
import img from '../../../static/files/img/index/movies/rank1.jpg';
class TicketsItem extends Component{
    //拿到票房的排名数据 对数据进行处理


    componentDidMount(){

    };
    render(){
        var {mid,mname,tickets,rank}=this.props;
        function checkRank(num){
            if(num<=3)
            return " textcolor-red";
            else 
            return "";
  
        }
        return (<li className="ranking-item">
                <a href="#">
                    <span>
                        <i className={'ranking-index'+checkRank(rank)}>{rank}</i>
                        <span className="ranking-movie-name">{mname}</span>
                        <span  className="ranking-num-info textcolor-red">
                            <span>{(tickets/10000).toFixed(2)}</span>万
                        </span>
                    </span>
                </a>

				</li>);
    };

};
TicketsItem.propTypes={
    mid:PropTypes.number.isRequired,
    mname:PropTypes.string.isRequired,
    tickets:PropTypes.string.isRequired,
    rank:PropTypes.number.isRequired
}
export default TicketsItem;