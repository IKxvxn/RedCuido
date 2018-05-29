import React from 'react';
import { Modal, Button, Row, Col, Input } from 'antd';
import Form from './esperaModalContaint'
import * as Permisos from '../../assets/permisos' 


class esperaContainer extends React.Component {
  state = {
    modalVisible: false,
    modal2Visible: false,
    modal3Visible: false,
    modal4Visible: false,
  }
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

  handleSubmit = () =>{this.form.handleSubmit(this.props.handleCreate);}
  handleAcceptCaso = (nota) =>{this.form.handleAcceptCaso(this.props.acceptCaso,nota,this.props.usuario)}
  handleRejectCaso = (nota) =>{this.form.handleRejectCaso(this.props.rejectCaso,nota,this.props.usuario)}
  handleDeleteCaso = (nota) =>{this.form.handleDeleteCaso(this.props.deleteCaso, nota)}


  handleModoTitle(){
    if (this.props.modo==="ver"){
      return(
      <Row gutter={8} type="flex" justify="end">
      <Col xs={12} sm={22}><h3>Detalles del Caso</h3></Col>
      <Col xs={12} sm={2}><Button icon="close" onClick={() => this.setmodalVisible(false)}></Button></Col>
       </Row>)}
       return(
        <Row gutter={8} type="flex" justify="end">
        <Col xs={12} sm={22}><h3>Ficha de Postulación de Caso</h3></Col>
        <Col xs={12} sm={2}><Button icon="close" onClick={() => this.setmodalVisible(false)}></Button></Col>
         </Row>)
  }

  handleModoOpenerTitle(){
    if (this.props.modo==="ver"){
      return <Button onClick={() => this.setmodalVisible(true)}>Detalles</Button>
    }
    return <Button disabled={Permisos.accessESPVISCRUD(this.props.usuario.tipo)} icon="file-add" type="primary" onClick={() => this.setmodalVisible(true)}>Agregar</Button>

  }

  handleModoFooter(){
    if (this.props.modo==="ver"){
      return(
        <Row gutter={8}  type="flex" justify="end">
              <Col xs={12} sm={8} style={{ marginBottom: 7}}><Button disabled={Permisos.accessESPVISACEP(this.props.usuario.tipo)} type="primary" loading={this.props.loading} ghost onClick={() => this.setmodal2Visible(true)}>Aceptar Caso</Button></Col>
              <Col xs={12} sm={8} style={{ marginBottom: 7}}><Button disabled={Permisos.accessESPVISACEP(this.props.usuario.tipo)} type="danger"  loading={this.props.loading} ghost onClick={() => this.setmodal3Visible(true)}>Rechazar Caso</Button></Col>
              <Col xs={24} sm={8} style={{ marginBottom: 7}}><Button disabled={Permisos.accessESPVISCRUD(this.props.usuario.tipo)} type="danger"  loading={this.props.loading} ghost onClick={() => this.setmodal4Visible(true)}>Eliminar</Button></Col>
        </Row>
      )
    }
    return(
      <Row gutter={8} type="flex" justify="end">
            <Col xs={12} sm={12}><Button type="primary"  loading={this.props.loading} ghost onClick={this.handleSubmit}>Agregar Caso</Button></Col>
            <Col xs={12} sm={12}><Button type="danger"  ghost onClick={() => this.setmodalVisible(false)}>Cancelar</Button></Col>
      </Row>
    )
  }

  handleAceptarFooter(){
      return(
        <Row gutter={8} type="flex" justify="end">
              <Col xs={12} sm={7}><Button type="primary" loading={this.props.loading} ghost onClick={()=>this.handleAcceptCaso(document.getElementById("nota").value)}>Aceptar</Button></Col>
              <Col xs={12} sm={7}><Button type="danger"  ghost onClick={() => this.setmodal2Visible(false)}>Cancelar</Button></Col>
        </Row>
      )
  }

  handleRechazarFooter(){
    return(
      <Row gutter={8} type="flex" justify="end">
            <Col xs={12} sm={7}><Button type="primary" loading={this.props.loading} ghost onClick={()=>this.handleRejectCaso(document.getElementById("nota").value)}>Aceptar</Button></Col>
            <Col xs={12} sm={7}><Button type="danger"  ghost onClick={() => this.setmodal3Visible(false)}>Cancelar</Button></Col>
      </Row>
    )
  }

  handleDeleteFooter(){
    return(
      <Row gutter={8} type="flex" justify="end">
            <Col xs={12} sm={7}><Button type="primary" loading={this.props.loading} ghost onClick={()=>this.handleDeleteCaso("")}>Eliminar</Button></Col>
            <Col xs={12} sm={7}><Button type="danger"  ghost onClick={() => this.setmodal4Visible(false)}>Cancelar</Button></Col>
      </Row>
    )
  }

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
          <Form visible={this.setmodalVisible} onRef={ref => (this.form = ref)}  modo={this.props.modo} row={this.props.row} usuario={this.props.usuario} editCaso={this.props.editCaso} downloadFile={this.props.downloadFile} deleteFiles={this.props.deleteFiles}/>
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

export default esperaContainer