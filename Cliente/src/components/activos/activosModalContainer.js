import React from 'react';
import { Modal, Button, Row, Col, Input } from 'antd';
import Form from './activosModalContaint'
import * as Permisos from '../../assets/permisos' 

class activosContainer extends React.Component {
  state = {
    modalVisible: false,
    modal2Visible: false,
    modal3Visible: false,
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

  handleSubmit = () =>{this.form.handleSubmit(this.props.handleCreate);}
  handleExcludeCaso = (nota) =>{this.form.handleExcludeCaso(this.props.excludeCaso, nota)}
  handleDeleteCaso = (nota) =>{this.form.handleDeleteCaso(this.props.deleteCaso, nota)}

  handleModoTitle(){
    if (this.props.modo === "ver") {
      return (
        <Row gutter={8} type="flex" justify="end">
          <Col xs={12} sm={22}><h3>Detalles del Adulto Mayor</h3></Col>
          <Col xs={12} sm={2}><Button icon="close" onClick={() => this.setmodalVisible(false)}></Button></Col>
        </Row>)
    }
    return (
      <Row gutter={8} type="flex" justify="end">
        <Col xs={12} sm={22}><h3>Ficha del Adulto Mayor</h3></Col>
        <Col xs={12} sm={2}><Button icon="close" onClick={() => this.setmodalVisible(false)}></Button></Col>
      </Row>)
  }

  handleModoOpenerTitle(){
    if (this.props.modo==="ver"){
      return <Button onClick={() => this.setmodalVisible(true)}>Detalles</Button>
    }
    return <Button icon="file-add" disabled={Permisos.accessGENLIST(this.props.usuario.tipo)} type="primary" onClick={() => this.setmodalVisible(true)}>Agregar</Button>

  }

  handleModoFooter(){
    if (this.props.modo==="ver"){
      return(
        <Row gutter={8} type="flex" justify="end">
              <Col xs={12} sm={8}style={{ marginBottom: 7}}><Button type="danger" disabled={Permisos.accessGENLIST(this.props.usuario.tipo)} loading={this.props.loading}  ghost onClick={() => this.setmodal2Visible(true)}>Excluir</Button></Col>
              <Col xs={12} sm={8}style={{ marginBottom: 7}}><Button type="danger"  disabled={Permisos.accessGENLIST(this.props.usuario.tipo)} loading={this.props.loading} ghost onClick={() => this.setmodal3Visible(true)}>Eliminar</Button></Col>
        </Row>
      )
    }
    return(
      <Row gutter={8} type="flex" justify="end">
            <Col xs={12} sm={7}><Button type="primary"  loading={this.props.loading} ghost onClick={this.handleSubmit}>Agregar</Button></Col>
            <Col xs={12} sm={7}><Button type="danger"  ghost onClick={() => this.setmodalVisible(false)}>Cancelar</Button></Col>
      </Row>
    )
  }

  handleExcluirFooter(){
    return(
      <Row gutter={8} type="flex" justify="end">
            <Col xs={12} sm={7}><Button type="primary" loading={this.props.loading} ghost onClick={()=>this.handleExcludeCaso(document.getElementById("nota").value)}>Aceptar</Button></Col>
            <Col xs={12} sm={7}><Button type="danger"  ghost onClick={() => this.setmodal2Visible(false)}>Cancelar</Button></Col>
      </Row>
    )
  }

  handleDeleteFooter(){
    return(
      <Row gutter={8} type="flex" justify="end">
            <Col xs={12} sm={7}><Button type="primary" loading={this.props.loading} ghost onClick={()=>this.handleDeleteCaso("")}>Eliminar</Button></Col>
            <Col xs={12} sm={7}><Button type="danger"  ghost onClick={() => this.setmodal3Visible(false)}>Cancelar</Button></Col>
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
          
          visible={this.state.modalVisible}
          closable={false}
          onCancel={() => this.setmodalVisible(false)}
          footer={[
            this.handleModoFooter()
          ]}
        >
          <Form visible={this.setmodalVisible} usuario={this.props.usuario} onRef={ref => (this.form = ref)}  modo={this.props.modo} row={this.props.row} editCaso={this.props.editCaso}  downloadFile={this.props.downloadFile} deleteFiles={this.props.deleteFiles}/>
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
            this.handleExcluirFooter()
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

export default activosContainer