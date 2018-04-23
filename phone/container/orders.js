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
    Dimensions, Alert, BackAndroid, ListView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import config from '../config/index';
import DeviceStorage from "../assets/util/DeviceStorage";
const {width, height} = Dimensions.get('window');
class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo:{},
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),

        };
        this.jumpToUserInfo = this.jumpToUserInfo.bind(this);
        this.jumpToLogin = this.jumpToLogin.bind(this);
    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this._back.bind(this));

        DeviceStorage.get('userInfo').then(tags=>{
            this.getOrders(tags.user.userId);
            this.setState({
              userInfo:tags
            });
          });



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

    getOrders(userId) {
        fetch(config.baseUrl+'/web/bookingList?userId='+userId,{
            method: 'get'
        }).then((response) => response.json())
            .then((responseData) => {
                if (responseData.code == 1)
                {
                    this.setState({
                        dataSource:this.state.dataSource.cloneWithRows(responseData.data)
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

                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderMovie.bind(this)}
                    style={styles.listView}
                />

            </View>
        );
    }
    renderMovie(movie) {
        return (
            <TouchableOpacity style={styles.container} >
                <View style={styles.container}>
                    <Image
                        source={{uri: config.baseUrl+ movie.url}}
                        style={styles.small}
                    />
                    <View style={styles.rightContainer}>
                        <Text style={styles.title}>{movie.filmName}</Text>
                        <Text style={styles.originaltitle}>{movie.englishName}</Text>
                        <Text style={styles.introduce}>{"状态："+movie.status}</Text>
                        <Text style={styles.introduce}>{"导演："+movie.directors}</Text>
                        <Text style={styles.introduce}>{"取票码："+movie.ticketCode}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }




    // _push(movie) {
    //     this.props.navigator.push({
    //         id: 'Movie_details',
    //         passProps: {data:movie},
    //         component: Movie_details,
    //         sceneConfig: Navigator.SceneConfigs.HorizontalSwipeJump
    //     });
    // }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderTopWidth: 0.5,
        borderTopColor: '#E8E8E8'
    },
    loading: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFE439'
    },
    rightContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 7,
        textAlign: 'left',
    },
    originaltitle: {
        fontSize: 13,
        fontStyle:'italic',
        marginTop: -2,
        marginLeft: 7,
        marginBottom: 4,
    },
    introduce: {
        marginLeft: 7,
        textAlign: 'left',
    },
    small: {
        margin: 7,
        marginLeft: 13,
        width: 64,
        height: 103,
    },
    listView: {
        backgroundColor: '#F5F5F5',
    },


});

export default Orders;
