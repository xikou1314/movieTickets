import React from 'react';
import { Link } from 'react-router';

import Header from '../../component/header';
import Footer from '../../component/footer';
import '../../../static/css/films.css';
import img from '../../../static/files/img/films/1.jpg';
import request from '../../../static/util/request';
import config from "../../config";
class SearchPageContainer extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            listData:[]
        };

    };
    componentDidMount() {
        this.init();
    }
    componentWillReceiveProps(nextProps){
        console.log("props");
        console.log(this.props);
        console.log(nextProps);
        this.props=nextProps;
        this.init();
    }
    init(){
        request({
            url:"searchFilm",
            type:"get",
            data:{filmName:this.props.routeParams.filmName}
        }).then(res=>{
            console.log(res);
            if(res.code==1 && res.data.length>0){
                this.setState({
                    listData:res.data
                });
            }
        }).catch(err=>{
            console.log(err);
        })
    }
    getList(){
        var lists=[];
        if(this.state.listData.length>0){
            for(var i of this.state.listData)
            {
                lists.push(<li>
                    <div>
                        <img src={config.baseUrl+i.url}/>
                        <Link to={"/detail/"+i.filmId}><button>选座购票</button></Link>
                    </div>
                    <div>
                        <h2>{i.filmName}</h2>
                        <ul className="msg-list">
                            <li>
                                <span>片长:  </span><span>{i.filmTime}</span>
                            </li>
                            <li>
                                <span>导演:  </span><span>{i.directors}</span>
                            </li>
                            <li>
                                <span>演员:  </span><span>{i.performers}</span>
                            </li>
                        </ul>
                    </div>
                </li>);
            }
        }
        else{
            lists.push(<div style={{textAlign:"center"}}>暂无数据</div>);
        }
        console.log(lists);
        return lists;
    }



    render(){

        return (<div>
            <Header path={this.props.location.pathname}></Header>
            <div className="film-container">
                <div className="list-area">
                    <ul>
                        {this.getList()}
                    </ul>
                </div>
            </div>
            <Footer></Footer>
        </div>);
    };


};
SearchPageContainer.propTypes={
    location:React.PropTypes.any,
    routeParams:React.PropTypes.any
}
export default SearchPageContainer;