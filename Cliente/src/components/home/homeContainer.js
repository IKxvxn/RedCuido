import React from 'react';
import { connect } from 'react-redux'
import * as exampleActions from './homeActions'
import * as Style from '../../style/home'
import PropTypes from 'prop-types';
import { Layout, Menu, Icon, notification } from 'antd';
import Excluidos from '../excluidos/excluidosContainer'
import Espera from '../espera/esperaContainer'
import Activos from '../activos/activosContainer'
import { Route, Switch,Link } from 'react-router-dom'
import '../../style/home.css'
const {Content, Footer } = Layout;



class homeContainer extends React.Component {
  state = {
    current: '1',
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
      }
    });
  }
  openNotification = (e) => {
     if (e.key === "5"){
        notification['info']({
          message: 'Se ha recibido nueva solicitud.',
          description: 'Se ha ingresado nueva solicitud de postulante.',
          style: {
            width: 600,
            marginLeft: 335 - 600,
          },
          duration: 0,
        });
        notification['info']({
          message: 'Se ha recibido nueva solicitud.',
          description: 'Se ha ingresado nueva solicitud de postulante.',
          style: {
            width: 600,
            marginLeft: 335 - 600,
          },
          duration: 0,
        });
        notification['success']({
          message: 'Se ha aceptado solicitud.',
          description: 'Carlos Mena Arias ha sido agregado a lista de Beneficiarios Activos.',
          style: {
            width: 600,
            marginLeft: 335 - 600,
          },
          duration: 0,
        });

        notification['error']({
          message: 'Se ha rechazado solicitud.',
          description: 'Victoria Fallas García ha sido agregado a lista de Rechazados.',
          style: {
            width: 600,
            marginLeft: 335 - 600,
          },
          duration: 0,
        });
        notification['error']({
          message: 'Se ha rechazado solicitud.',
          description: 'Guillermo Herrera ha sido agregado a lista de Rechazados.',
          style: {
            width: 600,
            marginLeft: 335 - 600,
          },
          duration: 0,
        });

        notification['warning']({
          message: 'Se ha excluido a beneficiario.',
          description: 'Rebeca Loría Chinchilla ha sido agregado a lista de Beneficiarios Excluidos.',
          style: {
            width: 600,
            marginLeft: 335 - 600,
          },
          duration: 0,
        });
    }
    else{
      //Cambia selected key en menu
      this.setState({
        current: e.key,
      });
    }
  };
  
  render() {
    return (
      <Layout style={Style.body} >
        
        <Content style={Style.contenedor}>
          <div style={Style.contenido}>
            <Switch>
              <Route exact strict path='/home' component={Espera}/>
              <Route exact strict path='/activos' component={Activos}/>
              <Route exact strict path='/excluidos' component={Excluidos}/>
            </Switch>
          </div>
        </Content>
        <Footer style={Style.footer}>
          Red de Cuido C.R. ©2018
        </Footer>
        <Menu mode="horizontal" theme="dark" selectedKeys={[this.state.current]} style={Style.menu} onClick={this.openNotification}>
          <Menu.Item key="1"><Link to='/home'>Espera</Link></Menu.Item>
          <Menu.Item key="2"><Link to='/activos'>Activos</Link></Menu.Item>
          <Menu.Item key="3">Rechazados</Menu.Item>
          <Menu.Item key="4"><Link to='/excluidos'>Excluidos</Link></Menu.Item>
          <Menu.Item key="5"><Icon type="mail"/>Notificaciones</Menu.Item>
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