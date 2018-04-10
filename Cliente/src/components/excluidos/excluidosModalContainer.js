import React from 'react';
import { Modal, Button, Row, Col, Input } from 'antd';
import Form from './excluidosModalContaint'

class excluidosContainer extends React.Component {
  state = {
    modalVisible: false,
    modal2Visible: false,
  }
  setmodalVisible = (modalVisible) => {
    this.setState({ modalVisible });
  }

  setmodal2Visible = (modal2Visible) => {
    this.setState({ modal2Visible });
  }

  handleSubmit = () =>{this.form.handleSubmit(this.props.handleCreate);}
  handleReactivateCaso = (nota) =>{this.form.handleReactivateCaso(this.props.reactivateCaso, nota)}


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

  handleModoOpenerTitle(){
    if (this.props.modo==="ver"){
      return <Button onClick={() => this.setmodalVisible(true)}>Detalles</Button>
    }
    return <Button icon="file-add" type="primary" onClick={() => this.setmodalVisible(true)}>Agregar</Button>
  }

  handleModoFooter(){
    
    if (this.props.modo==="ver"){
      return(
        <Row gutter={8} type="flex" justify="end">
              <Col xs={12} sm={7}><Button type="primary" loading={this.props.loading} ghost onClick={() => this.setmodal2Visible(true)}>Reactivar</Button></Col>
              <Col xs={12} sm={7}><Button type="danger"  loading={this.props.loading} ghost>Eliminar</Button></Col>
        </Row>
      )
    }else{
    return(
      <Row gutter={8} type="flex" justify="end">
           <Col xs={12} sm={7}><Button type="primary"  loading={this.props.loading} ghost onClick={this.handleSubmit}>Agregar</Button></Col>
           <Col xs={12} sm={7}><Button type="danger"  ghost onClick={() => this.setmodalVisible(false)}>Cancelar</Button></Col>
      </Row>
    )}
  }

  handleReactivarFooter(){
    return(
      <Row gutter={8} type="flex" justify="end">
            <Col xs={12} sm={7}><Button type="primary" loading={this.props.loading} ghost onClick={()=>this.handleReactivateCaso(document.getElementById("nota").value)}>Aceptar</Button></Col>
            <Col xs={12} sm={7}><Button type="danger"  ghost onClick={() => this.setmodal2Visible(false)}>Cancelar</Button></Col>
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
          maskStyle={{backgroundColor:"#3aa4a4"}}
          destroyOnClose
          closable={false}
          visible={this.state.modalVisible}
          onCancel={() => this.setmodalVisible(false)}
          footer={[
            this.handleModoFooter()
          ]}
        >
          <Form onRef={ref => (this.form = ref)}  modo={this.props.modo} row={this.props.row} editCaso={this.props.editCaso}/>
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
      </div>
    );
  }
}

export default excluidosContainer