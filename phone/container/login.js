import React, {
    Component,
} from 'react';

import {
    Alert,
    StyleSheet,
    View,
    Text,
    BackAndroid,
    Image, Dimensions, TouchableOpacity, Navigator
} from 'react-native';
import EditView from '../component/EditView';
import LoginButton from '../component/LoginButton';
import Register from "./register";
const {width, height} = Dimensions.get('window');
import FirstPage from '../FirstPage';
import DeviceStorage from '../assets/util/DeviceStorage';
import config from '../config/index';
class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
                loginData:{}
        };
        this.jumpToRegister = this.jumpToRegister.bind(this);
        this.onPressCallback = this.onPressCallback.bind(this);
        this.jumpToIndex = this.jumpToIndex.bind(this);
    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this._back.bind(this))
    }
    _back() {
        if (this.props.navigator) {
            this.props.navigator.push({
                id: 'FirstPage',
                component: FirstPage,
                sceneConfig: Navigator.SceneConfigs.HorizontalSwipeJump
            });
            return true;
        }
        return false;
    }
    jumpToRegister(name){
        this.props.navigator.push({
            id: 'Register',
            passProps: {data:name},
            component: Register,
            sceneConfig: Navigator.SceneConfigs.HorizontalSwipeJump
        });
    }
    onPressCallback(){
        if(!this.state.loginData.userName || !this.state.loginData.password )
            return;
        this.fetchData(this.state.loginData);
    }
    jumpToIndex(name){
        this.props.navigator.push({
            id: 'FirstPage',
            passProps: {data:name},
            component: FirstPage,
            sceneConfig: Navigator.SceneConfigs.HorizontalSwipeJump
        });
    }
    fetchData(data) {
        fetch(config.baseUrl+'/web/login',{
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((response) => response.json())
            .then((responseData) => {
                if(responseData.code==0)
                {
                    DeviceStorage.save("userInfo",responseData.data);
                    DeviceStorage.save("isLogin","0");
                    Alert.alert(
                        '登录结果',
                        "登录成功",
                        [
                            {text: 'OK', onPress: () => this.jumpToIndex("")},
                        ]
                    );

                }
                else{
                    Alert.alert(
                        '登录结果',
                        "登录失败",
                        [
                            {text: 'OK', onPress: () => console.log('OK Pressed!')},
                        ]
                    )
                }
            }).catch(err=>{
                Alert.alert(
                    '登录结果',
                    "登录失败",
                    [
                        {text: 'OK', onPress: () => console.log('OK Pressed!')},
                    ]
                )
        });
    }
    render() {
        return (
            <View style={styles.loginview}>
                <View   style={{flexDirection: 'row',height:100,marginTop:1,
                    justifyContent: 'center',
                    alignItems: 'flex-start',}}>
                    <Image style={styles.logo} source={require('../assets/img/logo_phone.png')}/>
                </View>
                <View style={{marginTop:80}}>
                    <EditView  name='输入用户名' onChangeText={(text) => {
                        this.state.loginData.userName = text;
                    }}/>
                    <EditView name='输入密码' password={true} onChangeText={(text) => {
                        this.state.loginData.password = text;
                    }}/>
                    <LoginButton name='登录' onPressCallback={this.onPressCallback}/>
                    <TouchableOpacity onPress={()=>this.jumpToRegister("111")}>
                    <Text style={{color:"#4A90E2",textAlign:'center',marginTop:10}} >注册</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

}

var styles = StyleSheet.create({
    loginview: {
        flex: 1,
        padding: 30,
        backgroundColor: '#ffffff',
    },
    logo:{
        width:width/780*400,
        height:width/780*400
    }
});

export default UserInfo;
