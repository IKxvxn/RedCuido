import React from 'react';
import { connect } from 'react-redux'
import * as exampleActions from './homeActions'
import * as Style from '../../style/home'
import PropTypes from 'prop-types';
import { Layout, Menu } from 'antd';
import Espera from '../espera/esperaContainer'
import '../../style/home.css'
const {Content, Footer } = Layout;



class homeContainer extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
      }
    });
  }
  render() {
    return (
      <Layout style={Style.body} >
        
        <Content style={Style.contenedor}>
          <div style={Style.contenido}>
            <Espera />
          </div>
        </Content>
        <Footer style={Style.footer}>
          Red de Cuido C.R. ©2018
        </Footer>
        <Menu mode="horizontal" theme="dark" defaultSelectedKeys={["1"]} style={Style.menu}>
          <Menu.Item key="1">Espera</Menu.Item>
          <Menu.Item key="2">Activos</Menu.Item>
          <Menu.Item key="3">Rechazados</Menu.Item>
          <Menu.Item key="4">Excluhidos</Menu.Item>
        </Menu>
      </Layout>
    );
  }
}

homeContainer.propTypes = {
  ExampleFunction: PropTypes.func
}

homeContainer.defaultProps = {
  ExampleFunction: () => {}
}

function mapStateToProps(state) {
  return {
    ExapleofData: state.loginReducer.exampleReducer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    ExampleFunction: ()  => dispatch(exampleActions.ExampleFunction())
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(homeContainer)