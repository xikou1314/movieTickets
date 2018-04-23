import React, {
  Component
} from 'react';

import {
  AppRegistry,
  Navigator
} from 'react-native';
import DeviceStorage from './assets/util/DeviceStorage';
import FirstPage from './FirstPage';
class SampleAppMovies extends Component {
  componentDidMount(){
    DeviceStorage.clear();
  }
  render() {
    return (
      <Navigator
        style={{flex: 1}}
        initialRoute={{id: 'FirstPage', component: FirstPage}}
        configureScene={(route, routeStack) =>Navigator.SceneConfigs.FloatFromRight}
        renderScene={this.renderScene}
      />
    );
  }

  renderScene(route, navigator) {
    return <route.component {...route.passProps} navigator={navigator}/>;
  }
}

AppRegistry.registerComponent('SampleAppMovies', () => SampleAppMovies);
