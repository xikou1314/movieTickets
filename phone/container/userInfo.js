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
    Dimensions, Alert, BackAndroid
} from 'react-native';

import config from '../config/index';
const {width, height} = Dimensions.get('window');
class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo:{}
        };
        this.jumpToUserInfo = this.jumpToUserInfo.bind(this);
        this.jumpToLogin = this.jumpToLogin.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this._back.bind(this))
        this.getUserInfo();
    }

    jumpToUserInfo(name){
        this.props.navigator.push({
            id: 'User_Info',
            passProps: {data:name},
            component: UserInfo,
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
    getUserInfo() {
        fetch(config.baseUrl+'/web/userInfo?userId='+this.props.userId,{
            method: 'get'
        }).then((response) => response.json())
            .then((responseData) => {
                if (responseData.code == 1)
                {
                    this.setState({
                        userInfo:responseData.data[0]
                    });
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
    render() {


        return (
            <View style={styles.container}>
                <View style={styles.userInfo}>
                    <Image style={styles.avatar} source={this.state.userInfo && this.state.userInfo.avatar!=null?{uri:(config.baseUrl+this.state.userInfo.avatar)}:require('../assets/img/user.png')}/>
                </View>
                <View style={styles.box}>
                    <View style={styles.info}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>登录名:</Text><Text style={styles.infoText}>{this.state.userInfo.userName}</Text>
                        </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>姓名:</Text><Text style={styles.infoText}>{this.state.userInfo.name}</Text>
                      </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>手机号:</Text><Text style={styles.infoText}>{this.state.userInfo.phone}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>邮箱:</Text><Text style={styles.infoText}>{this.state.userInfo.email}</Text>
                        </View>
                    </View>
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
        backgroundColor:"#fff"
    },
    userInfo:{
        backgroundColor:"#fff",
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
    box: {
        justifyContent: "flex-start",
        borderTopWidth: 1,
        borderColor: "#ccc",
        width:width-width/768*100,
        height:height/1280*600,
        marginTop:80
    },
    title: {
        color: '#000',
        fontSize: 18,
        marginTop: 5,
        marginLeft: 5
    },
    info: {
    },
    infoItem: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'flex-start',

    },
    infoLabel : {
        color:'#2A2A2A',
        width:width/768*120,
        textAlign: 'right'
    },
    infoText : {
        width:240,
        marginLeft: 14,
        borderBottomWidth:1,
        borderBottomColor:'red',
        textAlign:'center'
    }

});

export default UserInfo;
