import React, {
  Component,
} from 'react';

import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Navigator,
  Dimensions, Alert, BackAndroid,ScrollView,TouchableWithoutFeedback,ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Login from '../container/login';
import moment from 'moment';
import config from '../config/index';
import DeviceStorage from "../assets/util/DeviceStorage";
import UserInfo from "./userInfo";
import FirstPage from "../FirstPage";
var Pingpp = require('pingpp-react-native');
const {width, height} = Dimensions.get('window');
class Booking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seats:[],
      selected:[],
      load:false,
      moveX:0,
      base:500-width/2,
      start:0,
      selectedNum:0,
      charge:null
    };
    this.getSeats = this.getSeats.bind(this);
    this.pressed = this.pressed.bind(this);
    this.getArrany = this.getArrany.bind(this);
    this.getSeatInfo = this.getSeatInfo.bind(this);
    this.getSelectedSeat = this.getSelectedSeat.bind(this);
    this.getSelectedArrany = this.getSelectedArrany.bind(this);
    this.onAnimationEnd = this.onAnimationEnd.bind(this);
    this.jumpToIndex = this.jumpToIndex.bind(this);
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this._back.bind(this));

    DeviceStorage.get('isLogin').then((tags)=>{
      if(tags!=0)
      {
        Alert.alert(
          '提示信息',
          '请先登录',
          [
            {text: 'OK',onPress:()=>this.jumpToLogin("")},
          ]
        );

      }
      else{
        DeviceStorage.get('userInfo').then(tags=>{
          this.setState({
            userInfo:tags
          });
        });
      }
    });
    this.getSeatInfo();
    this.getSelectedSeat();
    this.getCharge();
  }
  getSelectedSeat(){
    fetch(config.baseUrl+'/web/selectedSeat?arrangeId='+this.props.data.arrange.arrangeId,{
      method: 'get'
    }).then((response) => response.json())
      .then((responseData) => {
        if (responseData.code == 1)
        {
          this.getSelectedArrany(responseData.data);
        }
        else{
          this.getSelectedArrany([]);
        }

      }).catch(err=>{

    });
  }
  //构造座位数组
  getArrany(data){
    let seats=[];
    let choose=[];
    for(let i=0;i<this.props.data.arrange.row;i++)
    {
      var row=[]
      for(let j=0;j<this.props.data.arrange.column;j++)
      {
        row.push(0);
      };
      choose.push(row);
    }
    for(let i=0;i<this.props.data.arrange.row;i++)
    {
      var row=[]
      for(let j=0;j<this.props.data.arrange.column;j++)
      {
        row.push(0);
      }
      seats.push(row);
      choose.push(row);
    }
    for(var k of data)
    {
      var rk=k.row-1;
      var rc=k.column-1;
      seats[rk][rc]=1;
    }
    this.setState({
      seats,
      choose,
      load:true
    });
  }

  getSelectedArrany(data){
    let selected=[];
    for(let i=0;i<this.props.data.arrange.row;i++)
    {
      var row=[]
      for(let j=0;j<this.props.data.arrange.column;j++)
      {
        row.push(0);
      }
      selected.push(row);
    }
    if(data.length>0)
    {
      for(var k of data)
      {
        var rk=k.row-1;
        var rc=k.column-1;
        selected[rk][rc]=1;

      }
    }
    this.setState({
      selected,
      load:true
    });

  }
  getSmallSet(row,column){
    if(this.state.seats.length==0)
      return <Text>暂时没有数据</Text>;
    let rows=[];
    for(let i=0;i<row;i++)
    {
      var columns=[];
      for(let j=0;j<column;j++)
      {
        if(this.state.seats[i][j]==1)
          columns.push(<View style={this.state.selected[i][j]==1?styles.smallSeatRed:(this.state.choose[i][j]==0?styles.smallSeatWhite:styles.smallSeatGreen)}></View>);
        else
          columns.push(<View style={styles.smallBlack}></View>);
      }
      rows.push(<View style={styles.smallRow}>{columns}</View>)
    }
    return rows;
  }
  getSeats(row,column){
    if(this.state.seats.length==0)
      return <Text>暂时没有数据</Text>;
    let rows=[];
    for(let i=0;i<row;i++)
    {
      var columns=[];
      for(let j=0;j<column;j++)
      {
        if(this.state.seats[i][j]==1)
          columns.push(<TouchableOpacity  onPress={e=>this.pressed(i,j)}><Image style={styles.seatImg} source={this.state.selected[i][j]==1?require('../assets/img/seat_red.png'):(this.state.choose[i][j]==0?require('../assets/img/seat_white.png') : require('../assets/img/seat_green.png'))}/></TouchableOpacity>);
        else
          columns.push(<View style={styles.black}></View>);
      }
      rows.push(<View style={styles.rowItem}>{columns}</View>)
    }
    return rows;
  }
  //通过choose 查询setInfo 获得所选座位的id集合
  // getSeatDetail=()=>{
  //   const {choose,seatInfo} = this.state;
  //
  //   if(!choose || !seatInfo)
  //     return ;
  //
  //   var details=[];
  //   var texts=[];
  //   for(let i in choose)
  //   {
  //     for(let j in choose[i])
  //     {
  //         if(choose[i][j]==1)
  //         {
  //           for(let k of seatInfo)
  //           {
  //             if(k.row==i && k.column==j)
  //             {
  //               details.push(k);
  //             }
  //           }
  //         }
  //     }
  //   }
  //   for(var i of details)
  //   {
  //     texts.push(<Text style={styles.seatCode}>{i.seatCode}</Text>)
  //   }
  //   return texts;
  // }
  pressed(row,column){
    // Alert.alert(
    //   '登录结果',
    //   "登录成功row"+row+"column"+column,
    //   [
    //     {text: 'OK', },
    //   ]
    // );
    if(this.state.selected[row][column]==1)
      return ;
    var num=JSON.parse(JSON.stringify(this.state.selectedNum));
    var choose=JSON.parse(JSON.stringify(this.state.choose));
    var details=[];
    const {seatInfo} = this.state;
    if(choose[row][column]==0)
    {
      choose[row][column]=1;
      num++;
    }
    else
    {
      choose[row][column]=0;
      num--;
    }
    if(num>4)
    {
      choose[row][column]==0;
      num--;
      Alert.alert(
        '警告',
        "最多只能选择四个座位",
        [
          {text: 'OK',},
        ]
      );
      return ;
    }
    for(let i=0;i<choose.length;i++)
    {
      for(let j=0;j<choose[i].length;j++)
      {

        if(choose[i][j]===1)
        {
          for(let k of seatInfo)
          {
            if(k.row-1==i && k.column-1==j)
            {
              details.push(<Text style={styles.seatCode}>{k.seatCode}</Text>);
            }
          }
        }
      }
    }
      this.setState({
        choose,
        selectedNum:num,
        seatDetails:details
      });
  }
  //查询影厅座位信息
  getSeatInfo() {
    fetch(config.baseUrl+'/web/seatInfo?roomId='+this.props.data.arrange.roomId,{
      method: 'get'
    }).then((response) => response.json())
      .then((responseData) => {
        if (responseData.code == 0)
        {
          this.setState({
            seatInfo:responseData.data
          });
          this.getArrany(responseData.data)
        }

      }).catch(err=>{

    });
  }

  _back() {
    if (this.props.navigator) {
      this.props.navigator.pop();
      return true;
    }
    return false;
  }
  getTime(date) {
    var now = moment(new Date()).format("YY-MM-DD");
    if (moment(date).format("YY-MM-DD") == now)
      return '今天';
    else if (moment(date).subtract(1, "days").format("YY-MM-DD") == now)
      return '明天';
    else if (moment(date).subtract(2, "days").format("YY-MM-DD") == now)
      return '后台';
    else
      return '';
  }
  // 监听滚动
  onAnimationEnd(e){
    // 求出水平方向上的偏移量
    var offSetX = e.nativeEvent.contentOffset.x;
    if(this.state.start==0)
    {
      this.setState({
        start:1
      });
      return ;
    }
    this.setState({
      moveX:offSetX/6.7
    });
  }
  jumpToLogin(data){
    this.props.navigator.push({
      id: 'Login',
      passProps: {data},
      component: Login,
      sceneConfig: Navigator.SceneConfigs.HorizontalSwipeJump
    });
  }
  jumpToIndex(name){
    this.props.navigator.push({
      id: 'FirstPage',
      passProps: {data:name},
      component: FirstPage,
      sceneConfig: Navigator.SceneConfigs.HorizontalSwipeJump
    });
  }
  getCharge=()=>{
    fetch(config.baseUrl+'/web/phoneCharge',{
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({amount:100})
    }).then((response) => response.json()).then(res=>{
      console.log(res);
      console.log(res.charge);
      this.setState({
        charge:res.charge
      });
    })
  }
  charge=()=>{

    Pingpp.setDebug(true);

    /**
     * 调用支付
     * @param charge 或 order
     * @param function completionCallback  支付结果回调 (result)
     */
    Pingpp.createPayment(JSON.stringify(this.state.charge),function(result){
      //结果回调方法
      console.log(result);
      var res = JSON.parse(result);
      // var pay_result = res.pay_result;
      // var error_msg = res.error_msg;
      // var extra_msg = res.extra_msg;
      if(res.pay_result=="success")
      {
        ToastAndroid.show("付款成功", ToastAndroid.SHORT);
        this.buy();
      }
      else{
        ToastAndroid.show("付款失败", ToastAndroid.SHORT);
      }

    }.bind(this));
  }
  buy=()=>{
    if(this.state.selectedNum<1)
      return ;
    var data={};
    const {choose,seatInfo}=this.state;
    var seats=[];
    for(let i=0;i<choose.length;i++)
    {
      for(let j=0;j<choose[i].length;j++)
      {

        if(choose[i][j]===1)
        {
          for(let k of seatInfo)
          {
            if(k.row-1==i && k.column-1==j)
            {
              seats.push(k);
            }
          }
        }
      }
    }
    data.seats=seats;
    data.userId=this.state.userInfo.user.userId;
    data.arrangeId=this.props.data.arrange.arrangeId;
    data.filmId=this.props.data.filmDetail.filmId;
    data.roomId=this.props.data.arrange.roomId;
    fetch(config.baseUrl+'/web/pay',{
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((response) => response.json())
      .then((responseData) => {
            setTimeout(()=>{
              this.jumpToIndex("")
            },300);

      });

  }
  render() {


    return (
      <View style={styles.container}>

        <View style={styles.filmInfo}>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>{this.props.data.filmDetail.filmName}</Text>
            <Text style={styles.infoText}>{this.getTime(this.props.data.arrange.date)+"   "}{this.props.data.arrange.start.slice(0,-3)}</Text>
            <Text style={styles.infoText}>{this.props.data.arrange.roomName}</Text>
          </View>
          <View style={styles.infoBar}>
              <View style={styles.barItem}>
                <Image style={{width:20,height:20}} source={require('../assets/img/seat_red.png')}/>
                <Text>已选</Text>
              </View>
              <View style={styles.barItem}>
                <Image style={{width:20,height:20}} source={require('../assets/img/seat_white.png')}/>
                <Text>可选</Text>
              </View>
              <View style={styles.barItem}>
                <Image style={{width:20,height:20}} source={require('../assets/img/seat_green.png')}/>
                <Text>选中</Text>
              </View>
          </View>


        </View>
        <ScrollView
          style={styles.seat}
          horizontal={true}
          vertical={true}
          showsHorizontalScrollIndicator={false}
          maximumZoomScale={3}
          minimumZoomScale={0.3}
          centerContent={true}
          ref={(ref) => this.myScroll = ref}
          onMomentumScrollEnd={this.onAnimationEnd}
        >

          <View style={{width:1000,height:600}}>
            <View style={styles.screen}>
              <Image source={require('../assets/img/screen.png')}/>
            </View>
            <View style={styles.seats}>
              {this.getSeats(this.props.data.arrange.row,this.props.data.arrange.column)}
            </View>
          </View>

        </ScrollView>
        <View style={{
          width: 200,
          height:120,
          position:'absolute',
          top:119,
          backgroundColor: '#000',
          opacity: .3}}>
            <View style={styles.smallScreen}></View>
          {
            this.getSmallSet(this.props.data.arrange.row,this.props.data.arrange.column)
          }
          <View style={{width:86,height:70,borderWidth:2,borderColor:'red',position:'absolute',top:14,left:this.state.moveX}}>

          </View>
        </View>
        <View style={{width:width,height:120,borderWidth:0.3,borderColor:"#ccc"}}>
          <View style={{width:width,height:60,borderWidth:0.3,borderColor:"#ccc",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
            {this.state.seatDetails}
          </View>
          <TouchableOpacity
            style={{backgroundColor:"#3281DD",width:width,height:60,flexDirection:"row",justifyContent:"center",alignItems:"center"}}
            onPress={this.charge}
          >
            <Text style={{color:"#fff"}}>{(this.state.selectedNum*this.props.data.arrange.price).toFixed(2)}元   确认购票</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }





}

var styles = StyleSheet.create({
    container: {

    },
    filmInfo: {
      height: 160,
      borderBottomWidth:0.5,
      borderBottomColor: '#ccc'
    },
    infoContainer: {
      height: 100,
      justifyContent: 'center',
      marginTop: 20,
      marginLeft:16,
      marginRight:16,
      borderTopWidth:0.5,
      borderTopColor: '#ccc',
      borderBottomWidth:0.5,
      borderBottomColor: '#ccc'
    },
    infoText: {
      marginTop:4
    },
    infoBar: {
      flex:1,
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center'
    },
    barItem: {
      marginRight: 8,
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center'
    },
    seat: {
      marginTop: 10,
      borderColor: '#3281DD',
      borderWidth: 1,
      height: 400
    },
    scrollInner: {
      width: 1000,
      height: 800,
      backgroundColor: '#dcdcdc'
    },
    screen: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    seats: {
      flexDirection:'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10
    },
    rowItem: {
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    seatImg: {
      marginLeft:4,
      marginRight:4
    },
    black: {
      width:36,
      height:31,
      marginLeft:4,
      marginRight:4
    },
    seatMsg: {

    },
    smallRow: {
      flexDirection:"row",
      justifyContent:"center",
      alignItems:"center",
      marginTop:2
    },
    smallBlack: {
      width:10,
      height:10,
      marginLeft:1,
      marginRight:1
    },
    smallSeatRed: {
      backgroundColor:"red",
      width:10,
      height:10,
      marginLeft:1,
      marginRight:1
    },
    smallSeatWhite: {
      backgroundColor:"#fff",
      width:10,
      height:10,
      marginLeft:1,
      marginRight:1
    },
    smallSeatGreen: {
      backgroundColor:"green",
      width:10,
      height:10,
      marginLeft:1,
      marginRight:1
    },
    smallScreen: {
      width: 60,
      height: 10,
      borderWidth:1,
      borderColor:'#3281DD',
      marginTop:4,
      marginLeft:70
    },
    seatCode: {
      borderRadius:8,
      borderWidth:0.5,
      borderColor:"#000",
      paddingTop:4,
      paddingBottom:4,
      paddingLeft:4,
      paddingRight:4,
      marginLeft:2,
      marginRight:2
    }

});

export default Booking;
