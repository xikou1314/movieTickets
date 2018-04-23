import React , { Component ,PropTypes}from 'react';

class ScoreItem extends Component{
 


    componentDidMount(){

    };
    render(){
        var {mid,mname,rank,url,score}=this.props;

      

        if(rank==1)
        {
            return 	<li className="clear ranking-item-border ranking-item">
            <a href="#">
                <div className="ranking-top-left">
                    <span className="grade-top-icon"></span>
                    <img src={require('../../../static/files/'+url)} alt=""/>
                </div>
                <div className="ranking-top-right">

                    <span className="ranking-top-movie-name">{mname}</span>
                    <p className="ranking-top-wish">
                        <span className="textcolor-orange">{score}分</span>
                    </p>
                </div>
            </a>

        </li>;
        }
        else if(rank<=3)
        {
           return  	<li className="ranking-item">
								<a href="#">
									<span>
										<i className="ranking-index textcolor-orange">{rank}</i>
										<span className="ranking-movie-name">{mname}</span>
										<span  className="ranking-num-info textcolor-red">
											<span className="textcolor-orange">{score}分</span>
										</span>
									</span>
								</a>

				</li>;
        }
        else{
            return 	<li className="ranking-item">
            <a href="#">
                <span>
                    <i className="ranking-index">{rank}</i>
                    <span className="ranking-movie-name">{mname}</span>
                    <span  className="ranking-num-info textcolor-orange">
                        <span>{score}分</span>
                    </span>
                </span>
            </a>

        </li>;
        }

 
    }
};
ScoreItem.propTypes={
    mid:PropTypes.number.isRequired,
    mname:PropTypes.string.isRequired,
    rank:PropTypes.number.isRequired,
    url:PropTypes.string.isRequired,
    score:PropTypes.string.isRequired
}
export default ScoreItem;