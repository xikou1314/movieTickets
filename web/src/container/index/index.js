import React ,{Component}from 'react';
import uuid from 'node-uuid';
import { Link } from 'react-router';
import request from '../../../static/util/request';
import {session,local} from '../../../static/util/storage';
//导入css样式

import '../../../static/css/index.css';

//导入组件
import Header from '../../component/header';
import Footer from '../../component/footer';
import Banner from '../../component/banner';
import MovieItemNow from '../../component/MovieItem/now';





class IndexPageContainer extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            hotFilms:[],
            banner:[{
              id:1,
              href:"",
              title:"1",
              img:"img/index/banner/banner1.jpg"
            },
            {
              id:2,
              href:"",
              title:"2",
              img:"img/index/banner/banner2.jpg"
            },
            {
              id:3,
              href:"",
              title:"3",
              img:"img/index/banner/banner3.jpg"
            },
        ]
        };
	  };
	componentWillMount(){

    this.getHotFilm();
    // console.log(this.props);
    // console.log(this.props.location.pathname);
    // console.log("获得session信息");
    // console.log(session.get("userInfo"));
    // console.log(session.get("token"));
    // console.log(session.get("isLogin"));
    this.getCarousel();
  };
  getCarousel(){
    request({
      url:"getCarousel",
      type:"get",
    }).then(res=>{
      console.log("返回结果");
      console.log(res);
      var banner = [];
      for(var i=0;i<res.data.length;i++){
        banner.push({
          id:res.data[i].id,
          href:res.data[i].href,
          title:res.data[i].title,
          img:res.data[i].imgUrl
        })
      }
      this.setState({
        banner
      });
      
    }).catch(err=>{
      console.log(err);
      console.log("错误信息");
    })
  }
  getHotFilm(){
      request({
        url:"hotfilm",
        type:"get",
      }).then(res=>{
        console.log("返回结果");
        console.log(res);
        if(res.code==1)
        {
          let data=[];
          for(var i of res.data)
          {
            data.push({
              filmId:i.filmId,
              filmName:i.filmName,
              url:i.url
            })
          }
          this.setState({hotFilms:data});
        }
        
      }).catch(err=>{
        console.log(err);
        console.log("错误信息");
      })
  }
    render(){
      var data=[{
          id:1,
          href:"",
          title:"1",
          img:"img/index/banner/banner1.jpg"
        },
        {
          id:2,
          href:"",
          title:"2",
          img:"img/index/banner/banner2.jpg"
        },
        {
          id:3,
          href:"",
          title:"3",
          img:"img/index/banner/banner3.jpg"
        },
    ];
 
    var nowFilms=[];
    for(var i of this.state.hotFilms)
    {
      var now=<MovieItemNow key={uuid.v4()} mid={i.filmId} mname={i.filmName} url={i.url}></MovieItemNow>;
      nowFilms.push(now);
    }
    return (
    <div>
        <Header path={this.props.location.pathname}>
        </Header>
        <Banner data={this.state.banner}></Banner>

        <div id="content">
              <div id="main">
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title textcolor-red" id="hotMoviesCount">正在热映</span>
            </div>
            <div className="panel-content">
                <ul className="movie-list clear" id="hotMovies">

                    {
                      nowFilms.map(function(value){
                        return value;
                      })
                    }
                </ul>
            </div>
          </div>
          </div>
        </div>
        <Footer></Footer>

    </div>);
    };
};
IndexPageContainer.propTypes={
  location:React.PropTypes.any
}

export default IndexPageContainer;