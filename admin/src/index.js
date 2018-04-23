import React from 'react';
import ReactDOM from 'react-dom';
import {Router,browserHistory} from 'react-router';
import AppRoutes from './router';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render( <Router routes={AppRoutes} history={browserHistory} queryKey={false} />, document.getElementById('root'));
registerServiceWorker();
