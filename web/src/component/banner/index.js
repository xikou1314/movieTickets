import React ,{Component,PropTypes} from 'react';
import Img from '../../../static/files/img/index/banner/banner1.jpg';
import uuid from 'node-uuid';
import config from '../../config/index';
const LIWIDTH=1423;
var index=0;
var timer=null;
function move(size)
{
    if(index==size)
    {
        $('#banner-item').css({left:0});//放到最前面一张
        index=1;//将i移动到第二张的位置
    }
    if(index==-1)
    {
        $('#banner-item').css({left:-(size-1)*LIWIDTH});//放到最后一张
        index=size-2;//将i移动到倒数第二张的位置
    }
    $('#banner-item').stop().animate({left:-index*LIWIDTH},500);
    //移动后调整小圆点 当前在最后一张的时候 其实已经在视觉上已经是第一张了 将小圆点移动到第一张的位置
    if(index==size-1)
    {
        $('.indicators li').eq(0).addClass('active').siblings().removeClass('active');
    }
    else{
        $('.indicators li').eq(index).addClass('active').siblings().removeClass('active'); 
        
    }

}
class Banner extends Component{
    //需要一个图片的数据组
    constructor(props)
    {
        super(props);
        this.state={
            size:0

        };
    };
    componentWillReceiveProps(next){
        this.setState({
            size:next.data.length+1
        });
        
        
    }

    componentDidMount(){
            //自动轮播

        timer=setInterval(function(){
                index++;
                move(this.state.size);

        }.bind(this),2000);

        //对banner定时器的操作


        $('#banner').hover(function(){
            clearInterval(timer);
        },function(){
            timer=setInterval(function(){index++;move(this.state.size);}.bind(this),2000);
        }.bind(this));

        //向左的按钮

        $('#banner .clk-pre').click(function(){
            index--;
            move(this.state.size);
        }.bind(this));

        //向右按钮

        $('#banner .clk-next').click(function(){
            index++;
            move(this.state.size);
        }.bind(this));
  

    };
    componentWillUnmount(){
        clearInterval(timer);
        index=0;
    }
    render(){

        var {data}=this.props;
        if(data.length<1)
        return <div>暂无图片</div>;
        data.push(data[0]);
        //图片的个数 图片的宽度
        var bannerCount = data.length;
        var imgs=[];
        for(var i=0;i<data.length;i++)
        {
            imgs.push(<li key={uuid.v4()}>
                <a href={data[i].href} title={data[i].title}>
                    <img src={config.baseUrl+data[i].img} alt={'电影-'+data[i].title}></img>
                </a>

            </li>);
        } 
        var lis=[];
        for(var i=0;i<bannerCount-1;i++)
        {
            if(i==0)
            lis.push(<li className='active' key={uuid.v4()}></li>);
            else
            lis.push(<li key={uuid.v4()}></li>);
        }   

        return (  
            <div className='banner clear' id='banner'>
            <ul className='clear' id='banner-item' style={{width:bannerCount*LIWIDTH+'px'}}>
               	{
                       imgs.map(function(value){
                           return value;
                       })
                }
    
            </ul>

            <a href='javascript:;' className='clk clk-pre'></a>
            <a href='javascript:;' className='clk clk-next'></a>

        <ul className='indicators clear'>
            {
                lis.map(function(value){
                    return value;
                })
            }
        </ul>
    </div>
);
    };
};
Banner.propTypes={
    data: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        img: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired
      }))
};
export default Banner;