import React, { Component } from 'react';
import {Layout} from 'antd';
import Login from './components/login/loginContainer'
import Home from './components/home/homeContainer'

class App extends Component {
  render() {
    return (
      <Layout  className="body">
          <Home />
      </Layout>
    );
  }
}

export default App;
