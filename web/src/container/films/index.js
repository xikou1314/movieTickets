import React from 'react';
import { Link } from 'react-router';

import Header from '../../component/header';
import Footer from '../../component/footer';
import '../../../static/css/films.css';
import img from '../../../static/files/img/films/1.jpg';
import request from '../../../static/util/request';
import config from "../../config";
class FilmsPageContainer extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            listData:[],
            count:0,
            current:1,
            class:"全部",
            area:"全部",
            age:"全部"

        };
        this.getList=this.getList.bind(this);
        this.pageSearch=this.pageSearch.bind(this);
        this.setClass=this.setClass.bind(this);
        this.setAge=this.setAge.bind(this);
        this.search=this.search.bind(this);
    };
    componentDidMount(){
        this.init();
    }
    search(params){
        //拿到page class area age去请求数据
        this.setState({
            listData:[],
            count:0
        })
        var param={};
        if(params.class!="全部")
        {
            param.class=params.class;
        }
        if(params.area!="全部")
        {
            param.area=params.area;
        }
        if(params.age!="全部")
        {
            param.age=params.age;
        }
        param.page=params.page;
        request({
            url:"films",
            type:"get",
            data:param
        }).then(res=>{
            if(res.code==1)
            {
                this.setState({
                    listData:res.data,
                    count:res.count
                });
            }

        })

    }
    init(){
        request({
            url:"films",
            type:"get",
            data:{page:1}
        }).then(res=>{
            console.log(res);
            console.log(res.data);
            this.setState({
                listData:res.data,
                count:res.count
            });
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
    getPage(){
        console.log(this.state.count);
        var pageNumber=Math.ceil(this.state.count/10);
        var lists=[];
        console.log(pageNumber);
        for(let i=1;i<=pageNumber;i++){
            lists.push(<li className={this.state.current==i?"pageActive":""} onClick={e=>this.pageSearch(i)}>{i}</li>);
        }
        return lists;
    }
    pageSearch(number){
        if((this.state.current==1&&number=="pre")||(this.state.current==this.state.count&&number=="next") )
            return ;
        var pageNumber=0;
        if(number=="pre")
        {
            var current=this.state.current;
                current=current-1;
            this.setState({
                current:current
            });
            pageNumber=current;

        }
        else if(number=="next"){
            var current=this.state.current;
            current=current+1;
            this.setState({
                current:current
            });
            pageNumber=current;

        }
        else{
            this.setState({
                current:number
            });
            pageNumber=number;
        }

        request({
            url:"films",
            type:"get",
            data:{page:pageNumber}
        }).then(res=>{
            this.setState({
                listData:res.data,
                count:res.count
            });
        }).catch(err=>{
            console.log(err);
        })
    }
    setClass(className){
        console.log(className);
        this.setState({
            class:className,
            current:1
        });
        this.search({
            page:1,
            area:this.state.area,
            class:className,
            age:this.state.age
        });
    }
    setArea(areaName){
        console.log(areaName);
        this.setState({
            area:areaName,
            current:1
        });
        this.search({
            page:1,
            area:areaName,
            class:this.state.class,
            age:this.state.age
        });
    }
    setAge(age){
        this.setState({
            age,
            current:1
        });
        this.search({
            page:1,
            area:this.state.area,
            class:this.state.class,
            age:age
        });
    }
    render(){
    return (<div>
        <Header path={this.props.location.pathname}></Header>
        <div className="film-container">
            <div className="search-area">
                <div className="search-item">
                    <span>类型:</span>
                    <span className={this.state.class=="全部"?"selectActive":""} onClick={e=>this.setClass("全部")}>全部</span>
                    <span className={this.state.class=="爱情"?"selectActive":""} onClick={e=>this.setClass("爱情")}>爱情</span>
                    <span className={this.state.class=="喜剧"?"selectActive":""}  onClick={e=>this.setClass("喜剧")}>喜剧</span>
                    <span className={this.state.class=="动画"?"selectActive":""}  onClick={e=>this.setClass("动画")}>动画</span>
                    <span className={this.state.class=="剧情"?"selectActive":""}  onClick={e=>this.setClass("剧情")}>剧情</span>
                    <span className={this.state.class=="恐怖"?"selectActive":""} onClick={e=>this.setClass("恐怖")}>恐怖</span>
                    <span className={this.state.class=="惊悚"?"selectActive":""} onClick={e=>this.setClass("惊悚")}>惊悚</span>
                    <span className={this.state.class=="科幻"?"selectActive":""} onClick={e=>this.setClass("科幻")}>科幻</span>
                    <span className={this.state.class=="动作"?"selectActive":""} onClick={e=>this.setClass("动作")}>动作</span>
                    <span className={this.state.class=="悬疑"?"selectActive":""} onClick={e=>this.setClass("悬疑")}>悬疑</span>
                    <span className={this.state.class=="犯罪"?"selectActive":""} onClick={e=>this.setClass("犯罪")}>犯罪</span>
                    <span className={this.state.class=="冒险"?"selectActive":""} onClick={e=>this.setClass("冒险")}>冒险</span>
                    <span className={this.state.class=="战争"?"selectActive":""} onClick={e=>this.setClass("战争")}>战争</span>
                    <span className={this.state.class=="奇幻"?"selectActive":""} onClick={e=>this.setClass("奇幻")}>奇幻</span>
                    <span className={this.state.class=="运动"?"selectActive":""} onClick={e=>this.setClass("运动")}>运动</span>
                    <span className={this.state.class=="家庭"?"selectActive":""} onClick={e=>this.setClass("家庭")}>家庭</span>
                    <span className={this.state.class=="古装"?"selectActive":""} onClick={e=>this.setClass("古装")}>古装</span>
                    <span className={this.state.class=="武侠"?"selectActive":""} onClick={e=>this.setClass("武侠")}>武侠</span>
                    <span className={this.state.class=="西部"?"selectActive":""} onClick={e=>this.setClass("西部")}>西部</span>
                    <span className={this.state.class=="历史"?"selectActive":""} onClick={e=>this.setClass("历史")}>历史</span>
                    <span className={this.state.class=="传记"?"selectActive":""} onClick={e=>this.setClass("传记")}>传记</span>
                    <span className={this.state.class=="情色"?"selectActive":""} onClick={e=>this.setClass("情色")}>情色</span>
                    <span className={this.state.class=="歌舞"?"selectActive":""} onClick={e=>this.setClass("歌舞")}>歌舞</span>
                    <span className={this.state.class=="黑色电影"?"selectActive":""} onClick={e=>this.setClass("黑色电影")}>黑色电影</span>
                    <span className={this.state.class=="短片"?"selectActive":""} onClick={e=>this.setClass("短片")}>短片</span>
                    <span className={this.state.class=="纪录片"?"selectActive":""} onClick={e=>this.setClass("纪录片")}>纪录片</span>
                    <span className={this.state.class=="其他"?"selectActive":""} onClick={e=>this.setClass("其他")}>其他</span>
                </div>
                <div className="search-item">
                    <span>区域:</span>
                    <span className={this.state.area=="全部"?"selectActive":""} onClick={e=>this.setArea("全部")}>全部</span>
                    <span className={this.state.area=="大陆"?"selectActive":""} onClick={e=>this.setArea("大陆")}>大陆</span>
                    <span className={this.state.area=="美国"?"selectActive":""} onClick={e=>this.setArea("美国")}>美国</span>
                    <span className={this.state.area=="韩国"?"selectActive":""} onClick={e=>this.setArea("韩国")}>韩国</span>
                    <span className={this.state.area=="日本"?"selectActive":""} onClick={e=>this.setArea("日本")}>日本</span>
                    <span className={this.state.area=="中国香港"?"selectActive":""} onClick={e=>this.setArea("中国香港")}>中国香港</span>
                    <span className={this.state.area=="中国台湾"?"selectActive":""} onClick={e=>this.setArea("中国台湾")}>中国台湾</span>
                    <span className={this.state.area=="泰国"?"selectActive":""} onClick={e=>this.setArea("泰国")}>泰国</span>
                    <span className={this.state.area=="印度"?"selectActive":""} onClick={e=>this.setArea("印度")}>印度</span>
                    <span className={this.state.area=="法国"?"selectActive":""} onClick={e=>this.setArea("法国")}>法国</span>
                    <span className={this.state.area=="英国"?"selectActive":""} onClick={e=>this.setArea("英国")}>英国</span>
                    <span className={this.state.area=="俄罗斯"?"selectActive":""} onClick={e=>this.setArea("俄罗斯")}>俄罗斯</span>
                    <span className={this.state.area=="意大利"?"selectActive":""} onClick={e=>this.setArea("意大利")}>意大利</span>
                    <span className={this.state.area=="西班牙"?"selectActive":""} onClick={e=>this.setArea("西班牙")}>西班牙</span>
                    <span className={this.state.area=="德国"?"selectActive":""} onClick={e=>this.setArea("德国")}>德国</span>
                    <span className={this.state.area=="波兰"?"selectActive":""} onClick={e=>this.setArea("波兰")}>波兰</span>
                    <span className={this.state.area=="澳大利亚"?"selectActive":""} onClick={e=>this.setArea("澳大利亚")}>澳大利亚</span>
                    <span className={this.state.area=="伊朗"?"selectActive":""} onClick={e=>this.setArea("伊朗")}>伊朗</span>
                    <span className={this.state.area=="其他"?"selectActive":""} onClick={e=>this.setArea("其他")}>其他</span>
                </div>
                <div className="search-item">
                    <span>年代:</span>
                    <span className={this.state.age=="全部"?"selectActive":""} onClick={e=>this.setAge("全部")}>全部</span>
                    <span className={this.state.age=="2018"?"selectActive":""} onClick={e=>this.setAge("2018")}>2018</span>
                    <span className={this.state.age=="2017"?"selectActive":""} onClick={e=>this.setAge("2017")}>2017</span>
                    <span className={this.state.age=="2016"?"selectActive":""} onClick={e=>this.setAge("2016")}>2016</span>
                    <span className={this.state.age=="2010~2015"?"selectActive":""} onClick={e=>this.setAge("2010~2015")}>2010~2015</span>
                    <span className={this.state.age=="2000~2009"?"selectActive":""} onClick={e=>this.setAge("2000~2009")}>2000~2009</span>
                    <span className={this.state.age=="90年代"?"selectActive":""} onClick={e=>this.setAge("90年代以前")}>90年代</span>
                    <span className={this.state.age=="90年代以前"?"selectActive":""} onClick={e=>this.setAge("90年代以前")}>90年代以前</span>
                </div>
            </div>
            <div className="list-area">
                <ul>
                    {this.getList()}
                </ul>
                <div className="pagenation">
                    <ul>
                        {this.state.listData.length>0?<li onClick={e=>this.pageSearch("pre")}>上一页</li>:""}
                        {this.getPage()}
                        {this.state.listData.length>0?<li onClick={e=>this.pageSearch("next")}>下一页</li>:""}
                    </ul>
                </div>
            </div>
        </div>
        <Footer></Footer>
    </div>);
    };


};
FilmsPageContainer.propTypes={
    location:React.PropTypes.any
}
export default FilmsPageContainer;