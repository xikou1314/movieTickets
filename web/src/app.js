import React from 'react';
import ReactDOM from 'react-dom';
import {Router,browserHistory} from 'react-router';

import 'babel-polyfill';

import AppRoutes from './route';
ReactDOM.render(
        <Router routes={AppRoutes} history={browserHistory} queryKey={false} />,
    document.getElementById('app-root')//这个app-root是在index.html中写的div,其id为app-root
);
