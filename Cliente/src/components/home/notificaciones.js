import React from "react";
import { Badge, Button, List, Row,Col, Popover,Icon } from 'antd';
import { Link } from 'react-router-dom'
import * as Localizacion from '../../assets/localizacion'
import {getLocation} from 'react-router-redux';
var dateFormat = require('dateformat');
const NOT = "NOT"

dateFormat.i18n = Localizacion.fecha

function generadorMensaje(item,usuario){
  var autor

  if(usuario.usuario===item.autor){
    autor="Tú"
  }
  else{
    autor=item.autor
  }

  let accion = (function(item){
    switch (item.action) {
    case "create":
      if (autor==="Tú"){
        return "Creaste"
      }
      else{
        return "Creó"
      }   
    case "update":
      if (autor==="Tú"){
        return "Modificaste"
      }
      else{
        return "Modificó"
      }   
    case "accepted":
      if (autor==="Tú"){
        return"Aceptaste"
      }
      else{
        return "Aceptó"
      }   
    case "rejected":
      if (autor==="Tú"){
        return "Rechazaste"
      }
      else{
        return "Rechazó"
      }   
    case "reactivate":
      if (autor==="Tú"){
        return"Reactivaste"
      }
      else{
        return "Reactivó"
      }   
    case "delete":
      if (autor==="Tú"){
        return "Borraste"
      }
      else{
        return "Borró"
      }   
    case "excluded":
      if (autor==="Tú"){
        return "Excluiste"
      }
      else{
        return "Excluyó"
      }   
    default:
      break;
  }}(item))
  
  if(item.location ==="activo"||item.location ==="rechazado"||item.location ==="excluido"){
    item.location=item.location+"s"
  }
  return <span><span style={{fontWeight:700}}>{accion}</span><span>{" un caso en la lista de "}<span style={{fontWeight:700}}>{item.location}</span></span></span>
}

function getPath(item){
  if(item.location ==="activo"||item.location ==="rechazado"||item.location ==="excluido"){
    item.location=item.location+"s"
  }  
  switch (item.action){
    case "create":
      return '/home/'+item.location
    case "update":
      return '/home/'+item.location
    case "reactivate":
      return '/home/espera'
    case "accepted":
      if(item.location==="espera"){return '/home/visita'}
      if(item.location==="visita"){return '/home/activos'}
      break;
    case "rejected":
      return '/home/rechazados'
    case "excluded":
      return '/home/excluidos'
    default:
      return '/home/espera'
  }
}


class bontonDescarga extends React.Component {
  render() {
      var content = (
        <List
          style={{maxHeight:"15rem",minWidth:"15rem", overflowX:"hidden",overflowY:"scroll"}}
          itemLayout="horizontal"
          dataSource={this.props.notificaciones}
          renderItem={(item,props=this.props) => (
            <List.Item style={{maxWidth:"15rem",minWidth:"15rem"}}>
              <List.Item.Meta
                avatar={
                  <Row gutter={8} type="flex" justify="center" style={{maxWidth:"3rem"}}>
                    <Col sm={24} >
                    <Link to={getPath(item)} onClick={()=>{this.props.changeCaller(NOT);this.props.changeId(item.caso)}}><Button shape="circle" disabled={(item.action==="delete")?true:false} type="secondary"><Icon type="eye" /></Button></Link>
                    </Col>
                    <Col sm={24} >
                       <Button onClick={()=>{this.props.deleteNotificacion(this.props.usuario,item._id)}} style={{margin:"0.2rem 0"}}shape="circle" type="danger"><Icon type="delete" /></Button>
                    </Col>
                  </Row>
                }
                title={
                  <Row gutter={8} type="flex" justify="start">
                    <Col sm={24} >
                    <span style={{color:"#00a148"}}>{item.autor}</span>
                    </Col>
                    <Col sm={24}>
                       <span style={{fontSize:"0.8rem",color:"#3aa4a4"}}>{dateFormat(new Date(item.fecha),"dd De mmmm, yyyy ~ hh:MM TT")}</span>
                    </Col>
                  </Row>
                }
                description={generadorMensaje(item,this.props.usuario)}
              />
            </List.Item>
          )}
        />
      );
    
    return( 
      <Popover placement="bottomRight" title={ <Button type="danger" ghost onClick={() =>{this.props.cleanNotificaciones(this.props.usuario)}}>Limpiar Notificaciones</Button>} content={content} trigger="click">
        <Badge count={this.props.notificaciones.length}>
            <Button shape="circle" type="danger" onClick={()=>this.props.getNotificaciones(this.props.usuario)}> <Icon type="notification" /></Button>
        </Badge>
      </Popover>)
    }
    
}


export default bontonDescarga