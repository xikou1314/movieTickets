import React , { Component }from 'react';
import uuid from 'node-uuid';


import {BackTop, Spin} from 'antd';
import DocumentTitle from 'react-document-title';
import {local, session} from '../../assets/util/storage'; 
import {browserHistory} from 'react-router';
import classNames from 'classnames';
import menuData from '../../menu';

import Header from '../../component/header';
import Sidebar from '../../component/sidebar';
import Content from '../../component/content';




class Layout extends Component {
		constructor(props)
		{
			super(props);
			this.state={
                mini:{},               //本地存储中拿出mini
				menuData: [],				//菜单的数据
				loading: false,				//是否加载
			};

		};
    isInArrany=(arrany,item)=>{
        for(let i=0;i<arrany.length;i++)
        {
          if(arrany[i].modleId==item.modleId)
            return i;
        }
        return -1;
    }
	componentWillMount(){
	      //构造列表
        //检查menuData 若用户的权限列表都为空
        var menuItems =  session.get("modle");
        console.log(menuItems);
        //根据数组每一项中的modleId对相同模块进行合并
        var menu = [];
        for(var i=0;i<menuItems.length;i++)
        {
            if(this.isInArrany(menu,menuItems[i])>=0)
            {
                var index=this.isInArrany(menu,menuItems[i]);
                   if(menuItems[i].create==1)
                   {
                      menu[index].create=1;
                   }
                   if(menuItems[i].read==1){
                     menu[index].read=1;
                   }
                   if(menuItems[i].update==1)
                   {
                     menu[index].update=1;
                   }
                   if(menuItems[i].delete==1)
                   {
                     menu[index].delete=1;
                   }

            }
            else{
              menu.push({
                modleId:menuItems[i].modleId,
                modleName:menuItems[i].modleName,
                create:menuItems[i].create,
                read:menuItems[i].read,
                update:menuItems[i].update,
                delete:menuItems[i].delete
              });
            }
        }
        console.log(menu);
        //根据menu修改menuData
        session.set('menuInfo',menu);
        var data=[];
        data.push(  {
          name: '概况',
          path: '/admin/home',
          icon: 'dashboard'
        });

        for(var i=0;i<menu.length;i++)
        {
            if(menu[i].modleName=="电影管理")
            {
              var children=[];
              if(menu[i].create==1)
              {
                children.push({
                  name: '电影添加',
                  path: '/admin/film/addFilm',
                  icon: 'circle'
                });
              }
              if(menu[i].read==1 ||menu[i].update==1 || menu[i].delete==1)
              {
                children.push({
                  name: '电影列表',
                  path: '/admin/film/filmList',
                  icon: 'circle'
                });
              }
              data.push({
                name: '电影管理',
                icon: 'star',
                path: '/admin/film',
                children
              });
            }
            if(menu[i].modleName=="用户管理")
            {
              var children=[];
              if(menu[i].create==1)
              {
                children.push({
                  name: '用户添加',
                  path: '/admin/user/addUser',
                  icon: 'circle'
                });
              }
              if(menu[i].read==1 ||menu[i].update==1 || menu[i].delete==1)
              {
                children.push({
                  name: '用户列表',
                  path: '/admin/user/userList',
                  icon: 'circle'
                });
              }
              data.push({
                name: '用户管理',
                icon: 'star',
                path: '/admin/user',
                children
              });
            }
            if(menu[i].modleName=="权限管理")
            {
              var children=[];
              if(menu[i].create==1)
              {
                children.push({
                  name: '添加角色',
                  path: '/admin/right/addRole',
                  icon: 'circle'
                });
              }
              if(menu[i].read==1 ||menu[i].update==1 || menu[i].delete==1)
              {
                children.push({
                  name: '角色列表',
                  path: '/admin/right/roleList',
                  icon: 'circle'
                });
              }
              data.push({
                name: '权限管理',
                icon: 'star',
                path: '/admin/right',
                children
              });
            }
            if(menu[i].modleName=="影厅管理")
            {
              var children=[];
              if(menu[i].create==1)
              {
                children.push({
                  name: '影厅添加',
                  path: '/admin/room/newRoom',
                  icon: 'circle'
                });
              }
              if(menu[i].read==1 ||menu[i].update==1 || menu[i].delete==1)
              {
                children.push({
                  name: '影厅列表',
                  path: '/admin/room/roomList',
                  icon: 'circle'
                });
              }
              data.push({
                name: '影厅管理',
                icon: 'star',
                path: '/admin/room',
                children
              });
            }
            if(menu[i].modleName=="场次管理")
            {
              var children=[];
              if(menu[i].create==1)
              {
                children.push({
                  name: '新建场次',
                  path: '/admin/arrange/newArrange',
                  icon: 'circle'
                });
              }
              if(menu[i].read==1 ||menu[i].update==1 || menu[i].delete==1)
              {
                children.push({
                  name: '场次列表',
                  path: '/admin/arrange/arrangeList',
                  icon: 'circle'
                });
              }
              data.push({
                name: '场次管理',
                icon: 'star',
                path: '/admin/arrange',
                children
              });
            }
            if(menu[i].modleName=="轮播管理")
            {

              data.push({
                name: '轮播管理',
                icon: 'star',
                path: '/admin/carousel',
              });
            }
        }
        this.setState({
            menuData: data
        })
	}
	componentDidMount() {
	
        this.setState({
            mini: local.get('mini')
        });	

	  };
	  handleMiniChange(mode) {
        local.set('mini', mode)
        this.setState({
            mini: mode
        })
    }

    handleSetLoading(type) {

        this.setState({
            loading: type
        })

    }
	
    render(){
        const cls = classNames({
            'mini': this.state.mini,
            'admin-framework': true
        });
        return (
            <div className={cls}>
                <Spin key="admin-framework-layout" spinning={this.state.loading} size="large">
                    <Header
                        miniMode={this.state.mini}
                        onMiniChange={this.handleMiniChange.bind(this)}
                        onSetLoading={this.handleSetLoading.bind(this)}
                    />
                     <Sidebar miniMode={this.state.mini} menuData={this.state.menuData} location={this.props.location}/>
                   <BackTop style={{right: '40px', bottom: '40px'}}/>
                    {
                        <Content>
                            {
                                this.props.children
                            }
                        </Content>
                    }
                </Spin>
            </div>
            
		  );
		
    };
};

export default Layout;



