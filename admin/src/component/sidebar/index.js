import React from 'react'
import {browserHistory, Link} from 'react-router'
import {Menu, Icon, Switch} from 'antd';
import FAIcon from '../faicon';
import '../../assets/css/sidebar.less';
import {local, session} from '../../assets/util/storage.js';
const SubMenu = Menu.SubMenu;


class Sidebar extends React.Component {
    state={
        openKeys:[]
    }
    //转换侧边栏菜单 
    convertSidebarMenu(menuData) {

        return menuData.map((val, index) => {
            if (val.children) {
                return (
                    <SubMenu key={ val.path} title={<span><FAIcon name={val.icon}/><span>{val.name}</span></span>}>
                        {
                            this.convertSidebarMenu(val.children)
                        }
                    </SubMenu>
                )

            } else {
                return (
                    <Menu.Item key={val.path}>
                        <Link to={val.path}><FAIcon name={val.icon}/><span>{val.name}</span></Link>
                    </Menu.Item>
                )

            }
        })
    }
    //获得侧边栏菜单
    getSideBarMenu() {

        //拿到manuData的数据
        let menuData = this.props.menuData
        //调用转换方法对数据进行转化
        return this.convertSidebarMenu(menuData);

    }
    //得到路径
    getMenuPath(menuData, pathName) {
        let menuPath = []
        let currentPath = pathName.split('/')

        function getPath(data, pathName, parentPath) {
            if (!data) return           //若data为空 返回

            for (let i = 0; i < data.length; i++) {
                let path = parentPath.slice()
                path.push(data[i].path) //保存父路径
                if (data[i].path == pathName) {
                    menuPath = path
                    break
                } else {
                    getPath(data[i].children, pathName, path)
                }
            }
        }

        while (menuPath.length === 0 && currentPath.length > 1) {
            getPath(menuData, currentPath.join('/'), [])
            currentPath.pop()
        }
        // menuPath array     current array
        return {
            menuPath: menuPath.slice(0, menuPath.length - 1).map(v =>  v),
            current: menuPath.slice(menuPath.length - 1, menuPath.length).map(v =>  v)
        }
    }
    onOpenChange = (keys) => {
        const state = this.state;

        var latestOpenKey = keys.find(key => !(state.openKeys.indexOf(key) > -1));

        this.setState({openKeys:[latestOpenKey]});
        
      }
    render() {

        const mini = this.props.miniMode;
        //拿到mini
        const mode = mini ? 'vertical' : 'inline';
        //设置mode模式
        const pathname = this.props.location.pathname === '/home' ? '/home/index' : this.props.location.pathname
        //拿到当前的路径名

        const {current} = this.getMenuPath(this.props.menuData, pathname)
        

        
        return (
            <aside className="admin-framework-sidebar">
                <Menu theme="light"
                      selectedKeys={current}
                      mode={mode}
                      onOpenChange={this.onOpenChange}
                      openKeys={this.state.openKeys}
                >
                    {
                        this.getSideBarMenu()
                    }
                </Menu>
            </aside>
        )
    }
}

export default Sidebar
