import React , { Component ,PropTypes}from 'react';
import img from '../../../static/files/img/index/movies/rank1.jpg';
class ExpectItem extends Component{
 


    componentDidMount(){

    };
    render(){
        var {mid,mname,rank,manWant,onTime,url}=this.props;

        var date=new Date(onTime*1000);

        if(rank==1)
        {
            return 	<li className="clear ranking-item-border ranking-item">
            <a href="#">
                <div className="ranking-top-left">
                    <span className="expect-top-icon"></span>
                    <img src={require('../../../static/files/'+url)} alt=""/>
                </div>
                <div className="ranking-top-right">

                    <span className="expect-top-title">{mname}</span>
                    <p className="expect-release-time">
                        上映时间:{date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()}
                    </p>
                    <p className="expect-top-wish">
                        <span>{manWant}</span>人想看
                    </p>


                </div>
            </a>

        </li>;
        }
        else if(rank<=3)
        {
           return  <li className="ranking-item expect-left ranking-item-border">
            <a href="#">
                <i className="expect-num">{rank}</i>
                <img src={require('../../../static/files/'+url)} alt=""/>
                <div className="expect-movie-name">{mname}</div>
                <span className="expect-movie-wish">{manWant}人想看</span>

            </a>

                </li>;
        }
        else{
            return 		<li className="ranking-item">
            <a href="#">
                <span>
                    <i className="ranking-index">{rank}</i>
                    <span className="ranking-movie-name">{mname}</span>
                    <span  className="ranking-num-info textcolor-orange">
                        <span>{manWant}人想看</span>
                    </span>
                </span>
            </a>

        </li>;
        }

 
    }
};
ExpectItem.propTypes={
    mid:PropTypes.number.isRequired,
    mname:PropTypes.string.isRequired,
    rank:PropTypes.number.isRequired,
    manWant:PropTypes.number.isRequired,
    onTime:PropTypes.number.isRequired,
    url:PropTypes.string.isRequired
}
export default ExpectItem;