import React from 'react';
import { Modal, Button, Row, Col, Input } from 'antd';
import Form from './visitaModalContaint'
import * as Permisos from '../../assets/permisos' 

class visitaContainer extends React.Component {
  //Define los mensajes de aceptación o cancelacion de acciones
  state = {
    modalVisible: false,
    modal2Visible: false,
    modal3Visible: false,
    modal4Visible: false,
  }
  //Setea visibilidad de los avisos
  setmodalVisible = (modalVisible) => {
    this.setState({ modalVisible });
  }
  setmodal2Visible = (modal2Visible) => {
    this.setState({ modal2Visible });
  }
  setmodal3Visible = (modal3Visible) => {
    this.setState({ modal3Visible });
  }
  setmodal4Visible = (modal4Visible) => {
    this.setState({ modal4Visible });
  }
  //Funciones que verifican el formulario segun la accion
  handleSubmit = () =>{this.form.handleSubmit(this.props.handleCreate);}
  handleAcceptCaso = (nota) =>{this.form.handleAcceptCaso(this.props.acceptCaso, nota,this.props.usuario)}
  handleRejectCaso = (nota) =>{this.form.handleRejectCaso(this.props.rejectCaso, nota,this.props.usuario)}
  handleDeleteCaso = (nota) =>{this.form.handleDeleteCaso(this.props.deleteCaso, nota)}

  //Define la estructura del titulo
  handleModoTitle(){
    if (this.props.modo==="ver"){
      return(
      <Row gutter={8} type="flex" justify="end">
      <Col xs={12} sm={22}><h3>Detalles del Adulto Mayor</h3></Col>
      <Col xs={12} sm={2}><Button icon="close" onClick={() => this.setmodalVisible(false)}></Button></Col>
       </Row>)}
       return(
        <Row gutter={8} type="flex" justify="end">
        <Col xs={12} sm={22}><h3>Ficha del Adulto Mayor</h3></Col>
        <Col xs={12} sm={2}><Button icon="close" onClick={() => this.setmodalVisible(false)}></Button></Col>
         </Row>)
  }
  //Define las acciones principales
  handleModoOpenerTitle(){
    if (this.props.modo==="ver"){
      return <Button onClick={() => this.setmodalVisible(true)}>Detalles</Button>
    }
    return <Button disabled={Permisos.accessESPVISCRUD(this.props.usuario.tipo)} icon="file-add" type="primary" onClick={() => this.setmodalVisible(true)}>Agregar</Button>

  }
  //Define el footer del modal (botones)
  handleModoFooter(){
    if (this.props.modo==="ver"){
      return(
        <Row gutter={8} type="flex" justify="end">
              <Col xs={12} sm={8}style={{ marginBottom: 7}}><Button type="primary" disabled={Permisos.accessESPVISACEP(this.props.usuario.tipo)} loading={this.props.loading} ghost onClick={() => this.setmodal2Visible(true)}>Aceptar Perfil</Button></Col>
              <Col xs={12} sm={8}style={{ marginBottom: 7}}><Button type="danger"  disabled={Permisos.accessESPVISACEP(this.props.usuario.tipo)} loading={this.props.loading} ghost onClick={() => this.setmodal3Visible(true)}>Rechazar Perfil</Button></Col>
              <Col xs={24} sm={8}style={{ marginBottom: 7}}><Button type="danger"  disabled={Permisos.accessESPVISCRUD(this.props.usuario.tipo)} loading={this.props.loading} ghost onClick={() => this.setmodal4Visible(true)}>Eliminar</Button></Col>
        </Row>
      )
    }
    return(
      <Row gutter={8} type="flex" justify="end">
            <Col xs={12} sm={7}><Button type="primary"  loading={this.props.loading} ghost onClick={this.handleSubmit}>Agregar Perfil</Button></Col>
            <Col xs={12} sm={7}><Button type="danger"  ghost onClick={() => this.setmodalVisible(false)}>Cancelar</Button></Col>
      </Row>
    )
  }
  //Footer del aviso al aceptar perfil
  handleAceptarFooter(){
      return(
        <Row gutter={8} type="flex" justify="end">
              <Col xs={12} sm={7}><Button type="primary" loading={this.props.loading} ghost onClick={()=>this.handleAcceptCaso(document.getElementById("nota").value)}>Aceptar</Button></Col>
              <Col xs={12} sm={7}><Button type="danger"  ghost onClick={() => this.setmodal2Visible(false)}>Cancelar</Button></Col>
        </Row>
      )
  }
  //Footer del aviso al rechazar perfil
  handleRechazarFooter(){
    return(
      <Row gutter={8} type="flex" justify="end">
            <Col xs={12} sm={7}><Button type="primary" loading={this.props.loading} ghost onClick={()=>this.handleRejectCaso(document.getElementById("nota").value)}>Aceptar</Button></Col>
            <Col xs={12} sm={7}><Button type="danger"  ghost onClick={() => this.setmodal3Visible(false)}>Cancelar</Button></Col>
      </Row>
    )
  }
  //Footer del a viso al eliminar perfil
  handleDeleteFooter(){
    return(
      <Row gutter={8} type="flex" justify="end">
            <Col xs={12} sm={7}><Button type="primary" loading={this.props.loading} ghost onClick={()=>this.handleDeleteCaso("")}>Eliminar</Button></Col>
            <Col xs={12} sm={7}><Button type="danger"  ghost onClick={() => this.setmodal4Visible(false)}>Cancelar</Button></Col>
      </Row>
    )
  }
  //Define la estructura del modal junto a los avisos posibles
  render() {
    return (
      <div>
      <Row>
        {this.handleModoOpenerTitle()}
        <Modal
          title={this.handleModoTitle()}
          maskStyle={{backgroundColor:"#88beb6"}}
          destroyOnClose
          closable={false}
          visible={this.state.modalVisible}
          onCancel={() => this.setmodalVisible(false)}
          footer={[
            this.handleModoFooter()
          ]}
        >
          <Form visible={this.setmodalVisible} onRef={ref => (this.form = ref)}  usuario={this.props.usuario} modo={this.props.modo} row={this.props.row} editCaso={this.props.editCaso} downloadFile={this.props.downloadFile} deleteFiles={this.props.deleteFiles}/>
        </Modal>
      </Row>
      <Row>
      <Modal
          title="Añada una nota antes de proceder:"
          visible={this.state.modal2Visible}
          destroyOnClose
          closable={false}
          onCancel={()=>this.setmodal2Visible(false)}
          footer={[
            this.handleAceptarFooter()
          ]}
          >
        <Input.TextArea rows={4} id="nota"/>
        </Modal>
      </Row>
      <Row>
      <Modal
          title="Añada una nota antes de proceder:"
          visible={this.state.modal3Visible}
          destroyOnClose
          closable={false}
          onCancel={()=>this.setmodal3Visible(false)}
          footer={[
            this.handleRechazarFooter()
          ]}
        >
        <Input.TextArea rows={4} id="nota"/>
        </Modal>
      </Row>
      <Row>
      <Modal
          title="Añada una nota antes de eliminar:"
          visible={this.state.modal4Visible}
          destroyOnClose
          closable={false}
          onCancel={()=>this.setmodal4Visible(false)}
          footer={[
            this.handleDeleteFooter()
          ]}
          >
          Esta acción es irreversible.
        </Modal>
      </Row>
      </div>
    );
  }
}

export default visitaContainer