import React from 'react';
import { connect } from 'react-redux'
import * as homeActions from './homeActions'
import * as loginActions from '../login/loginActions'
import * as Style from '../../style/home'
import Notificaciones from './notificaciones'
import { Layout, Menu } from 'antd';
import Espera from '../espera/esperaContainer'
import Visita from '../visita/visitaContainer'
import Activos from '../activos/activosContainer'
import Rechazados from '../rechazados/rechazadosContainer'
import Excluidos from '../excluidos/excluidosContainer'
import Usuarios from '../users/usersContainer'
import { Route, Switch,Link } from 'react-router-dom'
import '../../style/home.css'
const {Content, Footer } = Layout;
const TAB = "TAB"


class homeContainer extends React.Component {

  state = {
    caller:TAB,
    id:""
  }

  changeCaller = (state) =>{this.setState({caller:state})}
  changeId = (state) =>{this.setState({id:state})}

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
      }
    });
  }
  
  renderEspera = () => {
    return <Espera caller={this.state.caller} searchID={this.state.id} changeId={this.changeId} changeCaller={this.changeCaller}/>
  }

  renderVisita = () => {
    return <Visita caller={this.state.caller} searchID={this.state.id} changeId={this.changeId} changeCaller={this.changeCaller}/>
  }

  renderActivos = () => {
    return <Activos caller={this.state.caller} searchID={this.state.id} changeId={this.changeId} changeCaller={this.changeCaller}/>
  }

  renderRechazados = () => {
    return <Rechazados caller={this.state.caller} searchID={this.state.id} changeId={this.changeId} changeCaller={this.changeCaller}/>
  }

  renderExcluidos = () => {
    return <Excluidos caller={this.state.caller} searchID={this.state.id} changeId={this.changeId} changeCaller={this.changeCaller}/>
  }

  render() {
    //Cambia selected key en menu
    var tab = 1;

    switch(window.location.pathname) {
      case "/home/espera":
          tab = '1';
          break;
      case "/home/visita":
          tab = '2';
          break;
      case "/home/activos":
          tab = '3';
          break;
      case "/home/rechazados":
          tab = '4';
          break;  
      case "/home/excluidos":
          tab = '5';
          break;    
      case "/home/usuarios":
          tab = '7';
          break;            
      default:
          tab = '1';
    }

    return (
      <Layout style={Style.body} >
        
        <Content style={Style.contenedor}>
          <div style={Style.contenido}>
            <Switch>
              <Route exact path='/home/espera' render={this.renderEspera}/>
              <Route exact path='/home/visita' render={this.renderVisita}/>
              <Route exact path='/home/activos' render={this.renderActivos}/>
              <Route exact path='/home/excluidos' render={this.renderExcluidos}/>
              <Route exact path='/home/rechazados' render={this.renderRechazados}/>
              <Route exact path='/home/usuarios' component={Usuarios}/>
            </Switch>
          </div>
        </Content>
        <Footer style={Style.footer}>
          Red de Cuido C.R. ©2018
        </Footer>
        <Menu mode="horizontal" theme="dark" selectedKeys={[tab]} style={Style.menu} >
          <Menu.Item key="1"><Link to='/home/espera' onClick={() => this.changeCaller(TAB)}>Espera</Link></Menu.Item>
          <Menu.Item key="2"><Link to='/home/visita' onClick={() => this.changeCaller(TAB)}>Visita</Link></Menu.Item>
          <Menu.Item key="3"><Link to='/home/activos' onClick={() => this.changeCaller(TAB)}>Activos</Link></Menu.Item>
          <Menu.Item key="4"><Link to='/home/rechazados' onClick={() => this.changeCaller(TAB)}>Rechazados</Link></Menu.Item>
          <Menu.Item key="5"><Link to='/home/excluidos' onClick={() => this.changeCaller(TAB)}>Excluidos</Link></Menu.Item>
          <Menu.Item key="6"><Notificaciones getNotificaciones={this.props.getNotificaciones} changeCaller={this.changeCaller} changePlace={this.changePlace} changeId={this.changeId} deleteNotificacion={this.props.deleteNotificacion} cleanNotificaciones={this.props.cleanNotificaciones} usuario={this.props.usuario} notificaciones={this.props.notificaciones} /></Menu.Item>
          <Menu.Item key="7"><Link to='/home/usuarios'>Usuarios</Link></Menu.Item>
          <Menu.Item key="8"><Link to='' onClick={()=>{this.props.sessionlogout()}}>Salir</Link></Menu.Item>
        </Menu>
      </Layout>
    );
  }
  componentDidMount(){
    this.props.loadSessionState()
    this.props.getNotificaciones(this.props.usuario)
  }
  componentWillReceiveProps(NextProps) {
    if(NextProps.usuario.token!==this.props.usuario.token){
      
      
      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      
      async function notificacionesCaller(usuario,getNotificaciones) {
        getNotificaciones(usuario)
        await sleep(30000);
        notificacionesCaller(usuario,getNotificaciones)
      }
      notificacionesCaller(NextProps.usuario, this.props.getNotificaciones);
    }
  }
}

function mapStateToProps(state) {
  return {
    usuario: state.loginReducer.usuario,
    notificaciones: state.homeReducer.notificaciones
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getNotificaciones: (usuario)  => dispatch(homeActions.getNotificaciones(usuario)),
    cleanNotificaciones: (usuario)  => dispatch(homeActions.cleanNotificaciones(usuario)),
    deleteNotificacion: (usuario,notificacion)  => dispatch(homeActions.deleteNotificacion(usuario,notificacion)),
    loadSessionState: () => dispatch(loginActions.loadState()),
    sessionlogout: () => dispatch(loginActions.logout()),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(homeContainer)