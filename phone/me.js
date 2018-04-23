import React, {
    Component,
} from 'react';

import {
    Alert,
    Image,
    ListView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Navigator,
    Dimensions,
    Button
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import UserInfo from './container/userInfo';
import Orders from './container/orders';
import Login from './container/login';
import config from './config/index';
import Register from './container/register';
var REQUEST_URL = 'https://api.douban.com/v2/movie/coming_soon';
import DeviceStorage from './assets/util/DeviceStorage';
const {width, height} = Dimensions.get('window');
class Me extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo:{}
        };
        this.jumpToUserInfo = this.jumpToUserInfo.bind(this);
        this.jumpToLogin = this.jumpToLogin.bind(this);
    }

    componentDidMount() {
        DeviceStorage.get('isLogin').then((tags)=>{
            if(tags!=0)
            {
                this.jumpToLogin("");
            }
            else{
                DeviceStorage.get('userInfo').then(tags=>{
                    this.setState({
                        userInfo:tags
                    });
                });
            }
        });
    }

    jumpToUserInfo(userId){
        this.props.navigator.push({
            id: 'User_Info',
            passProps: {userId:userId},
            component: UserInfo,
            sceneConfig: Navigator.SceneConfigs.HorizontalSwipeJump
        });
    }
    jumpToOrders(name){
        this.props.navigator.push({
            id: 'Orders',
            passProps: {data:name},
            component: Orders,
            sceneConfig: Navigator.SceneConfigs.HorizontalSwipeJump
        });
    }
    jumpToLogin(name){
        this.props.navigator.push({
            id: 'Login',
            passProps: {data:name},
            component: Login,
            sceneConfig: Navigator.SceneConfigs.HorizontalSwipeJump
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.userInfo}>
                    <Image style={styles.avatar} source={this.state.userInfo.user&&this.state.userInfo.user.avatar!=null?{uri:(config.baseUrl+this.state.userInfo.user.avatar)}:require('./assets/img/user.png')}/>
                    <View style={styles.userName}>
                        <Text>{this.state.userInfo.user?this.state.userInfo.user.name:""}</Text>
                    </View>
                </View>

                <View style={styles.menuContainer}>
                    <TouchableOpacity onPress={()=>this.jumpToUserInfo(this.state.userInfo.user.userId)}>
                        <View style={styles.menuItem}>
                            <Icon name={"ios-bookmarks-outline"} size={16}></Icon>
                            <Text style={{marginLeft:6}}>基本信息</Text>
                            <Icon style={styles.arrowRight} name={"ios-arrow-forward"} size={16}></Icon>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.jumpToOrders("")}>
                    <View style={styles.menuItem}>
                        <Icon name={"ios-cart-outline"} size={16}></Icon>
                        <Text style={{marginLeft:6}}>用户订单</Text>
                        <Icon style={styles.arrowRight} name={"ios-arrow-forward"} size={16}></Icon>
                    </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:"#FBF8F6"
    },
    userInfo:{
       backgroundColor:"#FEAE37",
       width:width,
       height:height/1280*400,
       position:'absolute',
       top:0,
       left:0
    },
    avatar:{
        width:width/768*160,
        height:width/768*160,
        borderRadius:width/768*80,
        position:"relative",
        left:width/2-width/768*80,
        top:height/1280*200-width/768*80

    },
    userName:{
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop:width/768*140
    },
    menuContainer:{
        justifyContent: 'flex-start',
        position:"absolute",
        left:0,
        top:height/1280*430,
        backgroundColor:"#fff",
        width:width,
        height:height/1280*1000
    },
    menuItem:{
        flexDirection: 'row',
        marginTop:20,
        paddingLeft:10,
        borderBottomWidth:1,
        borderBottomColor:"#ccc",
        paddingBottom:8
    },
    arrowRight:{
        position:"absolute",
        right:10
    }

});

export default Me;
