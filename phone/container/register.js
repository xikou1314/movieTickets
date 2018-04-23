import React, {
    Component,
} from 'react';

import {
    Alert,
    StyleSheet,
    View,
    Text,
    BackAndroid,
    Image, Dimensions, Navigator,TouchableOpacity
} from 'react-native';
import EditView from '../component/EditView';
import LoginButton from '../component/LoginButton';
import Login from '../container/login';
import Me from "../me";
const {width, height} = Dimensions.get('window');
import config from '../config/index';
import FirstPage from '../FirstPage';
import DeviceStorage from "../assets/util/DeviceStorage";
class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.handleRegister = this.handleRegister.bind(this);
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
    jumpToLogin(name){
        this.props.navigator.push({
            id: 'Login',
            passProps: {data:name},
            component: Login,
            sceneConfig: Navigator.SceneConfigs.HorizontalSwipeJump
        });
    }
    handleRegister(){
        //注册调用的方法
        if(this.password!=this.passwordConfirm)
        {
            Alert.alert(
            '提示',
            "两次输入的密码请保持一致",
            [
                {text: 'OK', onPress: () => console.log('OK Pressed!')},
            ]
            );
            return ;
        }
        var data={
            userName:this.userName,
            password:this.password,
            isPhone:1
        };

        fetch(config.baseUrl+'/web/newUser',{
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((response) => response.json())
            .then((responseData) => {
                if(responseData.code==0)
                {
                    Alert.alert(
                        '注册结果',
                        "注册成功",
                        [
                            {text: 'OK', onPress: () => this.jumpToLogin("")},
                        ]
                    );

                }
                else{
                    Alert.alert(
                        '注册结果',
                        "注册失败",
                        [
                            {text: 'OK', onPress: () => console.log('OK Pressed!')},
                        ]
                    )
                }
            }).catch(err=>{
                    Alert.alert(
                        '注册结果',
                        "注册失败",
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
                        this.userName = text;
                    }}/>
                    <EditView name='输入密码' password={true} onChangeText={(text) => {
                        this.password = text;
                    }}/>
                    <EditView name='确认密码' password={true} onChangeText={(text) => {
                        this.passwordConfirm = text;
                    }}/>
                    <LoginButton name='注册' onPressCallback={this.handleRegister}/>
                    <TouchableOpacity onPress={()=>this.jumpToLogin("111")}>
                        <Text style={{color:"#3281DD",textAlign:'center',marginTop:10}} >登录</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this._back.bind(this))
    }
}

var styles = StyleSheet.create({
    loginview: {
        flex: 1,
        padding: 30,
        backgroundColor: '#ffffff'
    },
    logo:{
        width:width/780*400,
        height:width/780*400
    }
});

export default UserInfo;
