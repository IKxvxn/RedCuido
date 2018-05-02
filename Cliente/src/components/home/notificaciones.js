import React from "react";
import { Badge, Button, List, Row,Col, Popover,Icon } from 'antd';
import * as Localizacion from '../../assets/localizacion'
var dateFormat = require('dateformat');

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
    console.log(item)
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

  return accion+" un caso en lista de "+item.location
}

class bontonDescarga extends React.Component {
  state = {
  };

  render() {
      var content = (
        <List
          style={{maxHeight:"15rem",minWidth:"15rem", overflowX:"hidden",overflowY:"scroll"}}
          itemLayout="horizontal"
          dataSource={this.props.notificaciones}
          renderItem={item => (
            <List.Item style={{maxWidth:"15rem",minWidth:"15rem"}}>
              <List.Item.Meta
                avatar={
                  <Row gutter={8} type="flex" justify="center" style={{maxWidth:"3rem"}}>
                    <Col sm={24} >
                      <Button shape="circle" type="secondary"><Icon type="eye" /></Button>
                    </Col>
                    <Col sm={24} >
                       <Button style={{margin:"0.2rem 0"}}shape="circle" type="danger"><Icon type="delete" /></Button>
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
      <Popover placement="bottomRight" title={ <Button type="danger" ghost>Limpiar Notificaciones</Button>} content={content} trigger="click">
        {console.log("NOTTTT",this.props.notificaciones)}
        <Badge count={this.props.notificaciones.length}>
            <Button shape="circle" type="danger"> <Icon type="notification" /></Button>
        </Badge>
      </Popover>)
    }
}


export default bontonDescarga