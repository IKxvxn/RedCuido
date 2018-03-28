import React from 'react';
import { Modal, Button, Row, Col } from 'antd';
import Form from './esperaModalContaint'

class esperaContainer extends React.Component {
  state = {
    modalVisible: false,
  }
  setmodalVisible = (modalVisible) => {
    this.setState({ modalVisible });
  }

  handleSubmit = () =>{this.form.handleSubmit(this.props.handleCreate);}
  handleAcceptCaso = () =>{this.form.handleAcceptCaso(this.props.acceptCaso);}


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
    return <Button icon="file-add" type="primary" onClick={() => this.setmodalVisible(true)}>Postular</Button>

  }

  handleModoFooter(){
    
    if (this.props.modo==="ver"){
      return(
        <Row gutter={8} type="flex" justify="end">
              <Col xs={12} sm={7}><Button type="primary" loading={this.props.loading} ghost onClick={this.handleAcceptCaso}>Aceptar Caso</Button></Col>
              <Col xs={12} sm={7}><Button type="danger"  ghost onClick={() => this.setmodalVisible(false)}>Rechazar Caso</Button></Col>
        </Row>
      )
    }
    return(
      <Row gutter={8} type="flex" justify="end">
            <Col xs={12} sm={7}><Button type="primary"  loading={this.props.loading} ghost onClick={this.handleSubmit}>Postular Caso</Button></Col>
            <Col xs={12} sm={7}><Button type="danger"  ghost onClick={() => this.setmodalVisible(false)}>Cancelar</Button></Col>
      </Row>
    )
  }

  render() {
    return (
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
    );
  }
}

export default esperaContainer