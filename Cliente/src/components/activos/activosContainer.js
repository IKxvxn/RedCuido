import React from 'react';
import { connect } from 'react-redux'
import * as activosActions from './activosActions'
import { Table, Row, Col } from 'antd';
import Descarga from '../home/botonDescarga'
import Modal from './activosModalContainer'
var dateFormat = require('dateformat');



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
  
  columns = [{
    title: 'Cedula',
    dataIndex: 'cedula',
    key: 'cedula',
    sorter: (a, b) => Number(a.cedula.charAt(0)) - Number(b.cedula.charAt(0)) , 
  },{
    title: 'Apellidos',
    dataIndex: 'apellidos',
    key: 'apellidos',
    sorter: (a, b) => a.apellidos.localeCompare(b.apellidos),
  }, {
    title: 'Nombre',
    dataIndex: 'nombre',
    key: 'nombre',
  },{
    title: 'Fecha de Ingreso',
    dataIndex: 'ingreso',
    key: 'ingreso',
    render: (text) => <span>{dateFormat(new Date(text),"dd-mm-yyyy")}</span>,
  },{
    title: 'Teléfono',
    dataIndex: 'telefono',
    key: 'telefono',
  },{
    title: 'Sede',
    dataIndex: 'sede',
    key: 'sede',
    filters: [{text: 'Sede en Heredia', value: 'Heredia'}, {text: 'Sede en Desamparados',value: 'Desamparados'}],
    onFilter: (value, record) => record.sede.indexOf(value) === 0,
  },{
    title: 'Riesgo Social',
    dataIndex: 'riesgo',
    key: 'riesgo',
    render: text => <div className={text+" riesgoFormat"}>{text}</div>,
    filters: [{text: 'Riesgo 1', value: '1'}, {text: 'Riesgo 2',value: '2'},{text: 'Riesgo 3',value: '3'},{text: 'Riesgo 4',value: '4'}],
    onFilter: (value, record) => record.riesgo.indexOf(value) === 0,
  },{
    title: 'Acciones',
    key: 'acciones',
    render: (text, row) => <Modal modo="ver" row={row} />,
    fixed: 'right',
    width: "5rem",
  }];


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
      <Table rowSelection={this.rowSelection} columns={this.columns} dataSource={this.props.casosActivos} size= "middle" scroll={{ x: "90rem"}} pagination={{ pageSize: 8 }}  />
      </div>
    );
  }

   //Carga casos de espera cuando se carga el componente.
   componentDidMount(){
    this.props.getCasos()
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
    activarCaso: (caso,closer)  => dispatch(activosActions.activarCaso(caso,closer)),
    getCasos: (value) => dispatch(activosActions.getCasos(value)),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ActivosForm)