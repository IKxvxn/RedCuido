import React from 'react';
import { connect } from 'react-redux'
import * as esperaActions from './esperaActions'
import { Table, Row, Col } from 'antd';
import {columns, data} from './esperaTableModel'
import Descarga from '../home/botonDescarga'
import Modal from './esperaModalContainer'



class NormalLoginForm extends React.Component {
  
  state = {
    selectedRowKeys:[],
    selectedRows:[]
  }

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.setState({selectedRowKeys:selectedRowKeys,selectedRows:selectedRows})
    },
  };
  

  render() {
    return (
      <div>
      <Row gutter={8} type="flex" justify="end" style={{margin:"1rem 0"}}>
        <Col xs={12} sm={4}>
          <Modal loading={this.props.loading} handleCreate={this.props.createCaso} modo="crear" />
        </Col>
        <Col xs={12} sm={4}>
          <Descarga seleccionadas={this.state.selectedRows} todos={this.props.casosEspera} />
        </Col>
      </Row>
      <Table rowSelection={this.rowSelection} columns={columns} dataSource={this.props.casosEspera} size= "middle" scroll={{ x: "90rem"}} pagination={{ pageSize: 8 }}  />
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    casosEspera: state.esperaReducer.casosEspera,
    loading: state.esperaReducer.loading
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createCaso: (caso,closer)  => dispatch(esperaActions.createCaso(caso,closer))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(NormalLoginForm)