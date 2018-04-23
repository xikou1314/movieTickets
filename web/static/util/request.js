import _ from 'lodash';
import {hashHistory} from 'react-router';
import config from '../../src/config';
function request(option) {
    //深拷贝option
    let opt = _.cloneDeep(option);  //深拷贝
    console.log(config.baseUrl);
    // //加上权限
    // if("/login"!==opt.url)
    // {
    //     opt.beforeSend=function(xhr) {  
    //         let token = session.get('token')  
    //              xhr.setRequestHeader("Authorization", "Bearer " + token);  
    //      } 
    // }
    // 需要完善这个处理
    let hasProtocol = /(http|https)\:\/\//i.test(opt.url);  //检验是否以http:或者https:开头
    //url存在 不以http://或者https://开头 当前环境为开发环境
    if (opt.url && !hasProtocol) {
        opt.url = config.baseUrl + '/web/' + opt.url;          //在url中加入开头
    }



    // 设置默认 timeout 时间
    if (!opt.timeout) {
        opt.timeout = 1000 * 7.777;         //设置请求超时时间
    }
    //调用ajax的请求
    return Promise
        .resolve($.ajax.call($, opt))
        .then(res => {
            // 此处可以根据返回值做权限控制
            //console.log(res)

            // if (res.code === '401') {
       
            //     hashHistory.push('/login')
            // }

            // if (res.code === '403') {
            //    message.error('没有权限')
            // }

            return res
        })
        .catch(function (error) {
            // console.log('global handle ajax error:', error)
            return error
        })
}

export default request
