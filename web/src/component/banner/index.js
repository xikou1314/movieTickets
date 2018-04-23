import React ,{Component,PropTypes} from 'react';
import Img from '../../../static/files/img/index/banner/banner1.jpg';
import uuid from 'node-uuid';
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
    

        };
    };


    componentDidMount(){
        console.log(this.props);
        var size=$('#banner-item li').length;
        $('.indicators li').hover(function(e){
            var i=$(e.target).index();
            index=i;
            $('#banner-item').stop().animate({left:-index*LIWIDTH},500);
            $(e.target).addClass('active').siblings().removeClass('active');
        });
            //自动轮播

        timer=setInterval(function(){
                index++;
                move(size);

        },2000);

        //对banner定时器的操作

        $('#banner').hover(function(){
            clearInterval(timer);
        },function(){
            timer=setInterval(function(){index++;move(size);},2000);
        });

        //向左的按钮

        $('#banner .clk-pre').click(function(){
            index--;
            move(size);
        });

        //向右按钮

        $('#banner .clk-next').click(function(){
            index++;
            move(size);
        });
        


    };
    componentWillUnmount(){
        clearInterval(timer);
        index=0;
    }
    render(){

        console.log(this.props.data);
        var {data}=this.props;
        data.push(data[0]);
        //图片的个数 图片的宽度
        var bannerCount = data.length;
        var imgs=[];
        for(var b of data)
        {
            imgs.push(<li key={uuid.v4()}>
                <a href={b.href} title={b.title}>
                    <img src={require('../../../static/files/'+b.img)} alt={'电影-'+b.title}></img>
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