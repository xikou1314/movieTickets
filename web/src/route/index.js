import React from 'react';     
import { Route,Redirect,IndexRedirect } from 'react-router'; 

import RootContainer from '../container/root';
import IndexContainer from '../container/index';
import DetailPageContainer from '../container/detail';
import FilmsPageContainer from '../container/films';
import LoginPageContainer from '../container/login';
import RegisterPageContainer from '../container/register';
import UserCenterContainer from '../container/userCenter';
import BookingPageContainer from '../container/booking';
import SearchPageContainer from '../container/search';
import PayResult from '../container/payResult';
export default (
    <Route path="/" component={RootContainer}> 
        <IndexRedirect to='index'/>
        <Route path='index' component={IndexContainer}/>
        <Route path='detail/:filmId' component={DetailPageContainer}/>
        <Route path='films' component={FilmsPageContainer}/>
        <Route path='login' component={LoginPageContainer}/>
        <Route path='register' component={RegisterPageContainer}/>
        <Route path='payResult' component={PayResult}/>
        <Route path='userCenter/:currentKey' component={UserCenterContainer}/>
        <Route path='booking' component={BookingPageContainer}/>
        <Route path='search/:filmName' component={SearchPageContainer}/>
        <Redirect from='*' to='/'/>
    </Route>
);