import React, { Component } from 'react';
import {Layout} from 'antd';
import Login from './components/login/loginContainer'
import Home from './components/home/homeContainer'
import { Route, Switch } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <Layout  className="body">
      <Switch>
        <Route exact strict path='/' component={Login}/>
        <Route exact strict path='/home' component={Home}/>
      </Switch>
      </Layout>
    );
  }
}

export default App;
