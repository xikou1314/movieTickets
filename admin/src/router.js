import React from 'react';      //react核心
import { Route,Redirect,IndexRedirect } from 'react-router'; //创建route所需
import Root from './container/root';
import Login from './container/login'
import Test from './container/test';
import Layout from './container/layout';
import Home from './component/page/home';
import addFilm from './component/page/film/addFilm';
import FilmList from './component/page/film/filmList';
import FilmDetail from './component/page/film/filmDetail';
import addUser from './component/page/user/addUser';
import UserList from './component/page/user/userList';
import UserDetail from './component/page/user/userDetail';
import NewRoom from './component/page/room/newRoom';
import roomList from './component/page/room/roomList';
import roomDetail from './component/page/room/roomDetail';
import newArrange from './component/page/arrange/newArrange';
import arrangeList from './component/page/arrange/arrangeList';
import arrangeDetail from './component/page/arrange/arrangeDetail';
import RoleList from './component/page/right/roleList';
import roleDetail from './component/page/right/roleDetail';
import addRole from './component/page/right/addRole';
import Carousel from './component/page/carousel/carousel';
export default (
    <Route path="/" component={Root}> 
        <IndexRedirect to="/login" />        
        <Route path="/login" component={Login} /> 
        <Route path="/test" component={Test}/>
        <Route path="/admin" component={Layout}>
            <IndexRedirect to="home" />
            <Route path="home" component={Home}></Route>
            <Route path="film">
                <IndexRedirect to='addFilm' />
                <Route path='addFilm' component={addFilm}/>
                <Route path='filmList' component={FilmList}/>
                <Route path='filmDetail' component={FilmDetail}/>
            </Route>
            <Route path="user">
                <IndexRedirect to='addUser' />
                <Route path='addUser' component={addUser}/>
                <Route path='userList' component={UserList}/>
                <Route path='userDetail' component={UserDetail}/>
            </Route>
            <Route path="room">
                <IndexRedirect to='newRoom' />
                <Route path='newRoom' component={NewRoom}/>
                <Route path='roomList' component={roomList}/>
                <Route path='roomDetail' component={roomDetail}/>
            </Route>
            <Route path="arrange">
                <IndexRedirect to='newArrange' />
                <Route path='newArrange' component={newArrange}/>
                <Route path='arrangeList' component={arrangeList}/>
                <Route path='arrangeDetail' component={arrangeDetail}/>
            </Route>
            <Route path="right">
                <IndexRedirect to='newArrange' />
                <Route path='addRole' component={addRole}/>
                <Route path='roleList' component={RoleList}/>
                <Route path='roleDetail' component={roleDetail}/>
            </Route>
            <Route path="carousel" component={Carousel} />
        </Route>
        <Redirect from='*' to='/' />    
    </Route>
);