import React from 'react';
import { connect } from 'react-redux'
import * as activosActions from './activosActions'
import { Table, Row, Col } from 'antd';
import {columns, data} from './activosTableModel'
import Descarga from '../home/botonDescarga'
import Modal from './activosModalContainer'



class ActivosForm extends React.Component {
  
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
          <Modal loading={this.props.loading} handleCreate={this.props.activarCaso} modo="activar" />
        </Col>
        <Col xs={12} sm={4}>
          <Descarga seleccionadas={this.state.selectedRows} todos={this.props.casosActivos} />
        </Col>
      </Row>
      <Table rowSelection={this.rowSelection} columns={columns} dataSource={this.props.casosActivos} size= "middle" scroll={{ x: "90rem"}} pagination={{ pageSize: 8 }}  />
      </div>
    );
  }
}


function mapStateToProps(state) {
  console.log(state);
  return {
    casosActivos: state.activosReducer.casosActivos,
    loading: state.activosReducer.loading
  }
}

function mapDispatchToProps(dispatch) {
  return {
    activarCaso: (caso,closer)  => dispatch(activosActions.activarCaso(caso,closer))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ActivosForm)