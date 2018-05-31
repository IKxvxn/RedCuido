import React from 'react';
import { Modal, Button, Row, Col, Input } from 'antd';
import Form from './excluidosModalContaint'
import * as Permisos from '../../assets/permisos' 

class excluidosContainer extends React.Component {
  //variables de visibilidad para los avisos
  state = {
    modalVisible: false,
    modal2Visible: false,
    modal3Visible: false,
  }
  //setea las visibilidades
  setmodalVisible = (modalVisible) => {
    this.setState({ modalVisible });
  }
  setmodal2Visible = (modal2Visible) => {
    this.setState({ modal2Visible });
  }
  setmodal3Visible = (modal3Visible) => {
    this.setState({ modal3Visible });
  }
  //funciones para verificar el formulario
  handleSubmit = () =>{this.form.handleSubmit(this.props.handleCreate);}
  handleReactivateCaso = (nota) =>{this.form.handleReactivateCaso(this.props.reactivateCaso, nota)}
  handleDeleteCaso = (nota) =>{this.form.handleDeleteCaso(this.props.deleteCaso, nota)}

  //define el titulo del modal
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

  //define los botones de la tabla
  handleModoOpenerTitle(){
    if (this.props.modo==="ver"){
      return <Button onClick={() => this.setmodalVisible(true)}>Detalles</Button>
    }
    return <Button icon="file-add" type="primary" disabled={Permisos.accessESPVISACEP(this.props.usuario.tipo)} onClick={() => this.setmodalVisible(true)}>Agregar</Button>
  }

  //footer del modal (botones)
  handleModoFooter(){
    if (this.props.modo==="ver"){
      return(
        <Row gutter={8} type="flex" justify="end">
              <Col xs={12} sm={8}style={{ marginBottom: 7}}><Button type="primary" disabled={Permisos.accessESPVISACEP(this.props.usuario.tipo)} loading={this.props.loading} ghost onClick={() => this.setmodal2Visible(true)}>Reactivar</Button></Col>
              <Col xs={12} sm={8}style={{ marginBottom: 7}}><Button type="danger"  disabled={Permisos.accessESPVISACEP(this.props.usuario.tipo)} loading={this.props.loading} ghost onClick={() => this.setmodal3Visible(true)}>Eliminar</Button></Col>
        </Row>
      )
    }else{
    return(
      <Row gutter={8} type="flex" justify="end">
           <Col xs={12} sm={8}><Button type="primary"  loading={this.props.loading} ghost onClick={this.handleSubmit}>Agregar</Button></Col>
           <Col xs={12} sm={8}><Button type="danger"  ghost onClick={() => this.setmodalVisible(false)}>Cancelar</Button></Col>
      </Row>
    )}
  }

  //footer del aviso al reactivar el perfil
  handleReactivarFooter(){
    return(
      <Row gutter={8} type="flex" justify="end">
            <Col xs={12} sm={7}><Button type="primary" loading={this.props.loading} ghost onClick={()=>this.handleReactivateCaso(document.getElementById("nota").value)}>Aceptar</Button></Col>
            <Col xs={12} sm={7}><Button type="danger"  ghost onClick={() => this.setmodal2Visible(false)}>Cancelar</Button></Col>
      </Row>
    )
}

//footer del aviso al eliminar
handleDeleteFooter(){
  return(
    <Row gutter={8} type="flex" justify="end">
          <Col xs={12} sm={7}><Button type="primary" loading={this.props.loading} ghost onClick={()=>this.handleDeleteCaso("")}>Eliminar</Button></Col>
          <Col xs={12} sm={7}><Button type="danger"  ghost onClick={() => this.setmodal3Visible(false)}>Cancelar</Button></Col>
    </Row>
  )
}
  //establece la estructura del modal
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
          <Form onRef={ref => (this.form = ref)} visible={this.setmodalVisible} usuario={this.props.usuario} modo={this.props.modo} row={this.props.row} editCaso={this.props.editCaso}  downloadFile={this.props.downloadFile}  deleteFiles={this.props.deleteFiles}/>
        </Modal>
      </Row>
      <Row>
      <Modal
          title="Añada una nota antes de reactivar:"
          visible={this.state.modal2Visible}
          destroyOnClose
          closable={false}
          onCancel={()=>this.setmodal2Visible(false)}
          footer={[
            this.handleReactivarFooter()
          ]}
          >
        <Input.TextArea rows={4} id="nota"/>
        </Modal>
      </Row>
      <Row>
      <Modal
          title="Añada una nota antes de eliminar:"
          visible={this.state.modal3Visible}
          destroyOnClose
          closable={false}
          onCancel={()=>this.setmodal3Visible(false)}
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

export default excluidosContainer