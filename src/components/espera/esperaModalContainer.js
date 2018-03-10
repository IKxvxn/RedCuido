import React from 'react';
import { Modal, Button, Row } from 'antd';
import Form from './esperaModalContaint'

class App extends React.Component {
  state = {
    modalVisible: false,
  }
  setmodalVisible(modalVisible) {
    this.setState({ modalVisible });
  }

  render() {
    return (
      <Row>
        <Button onClick={() => this.setmodalVisible(true)}>Detalles</Button>
        <Modal
          title="Detalles del Caso"
          maskStyle={{backgroundColor:"#3aa4a4"}}
          destroyOnClose
          visible={this.state.modalVisible}
          closable={false}
          onCancel={() => this.setmodalVisible(false)}
          footer={[
            <Row>
                <Button style={{width:"10rem"}} type="primary" ghost onClick={() => this.setmodalVisible(false)}>Aceptar Caso</Button>
                <Button style={{width:"10rem"}} type="danger"  ghost onClick={() => this.setmodalVisible(false)}>Rechazar Caso</Button>
            </Row>,
          ]}
        >
          <Form row={this.props.row} />
        </Modal>
      </Row>
    );
  }
}

export default App