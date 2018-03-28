import React from 'react';
import { connect } from 'react-redux'
import * as esperaActions from './esperaActions'
import { Table, Row, Col } from 'antd';
import Descarga from '../home/botonDescarga'
import Modal from './esperaModalContainer'
var dateFormat = require('dateformat');



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

  columns = [{
    title: 'Cedula',
    dataIndex: 'cedula',
    key: 'cedula',
  },{
    title: 'Apellidos',
    dataIndex: 'apellidos',
    key: 'apellidos',
    sorter: (a, b) => a.apellidos.localeCompare(b.apellidos),
  }, {
    title: 'Nombre',
    dataIndex: 'nombre',
    key: 'nombre',
  }, {
    title: 'Fecha Ingreso',
    dataIndex: 'ingreso',
    key: 'ingreso',
    render: (text) => <span>{dateFormat(new Date(text),"dd-mm-yyyy")}</span>,
    sorter: (a, b) => new Date(a.ingreso) - new Date(b.ingreso), 
  }, {
    title: 'Prioridad',
    dataIndex: 'prioridad',
    key: 'prioridad',
    render: text => <div className={text+" prioridadFormat"}>{text}</div>,
    filters: [{text: 'Prioridad Alta', value: 'Alta'}, {text: 'Prioridad Media',value: 'Media'},{text: 'Prioridad Baja',value: 'Baja'}],
    onFilter: (value, record) => record.prioridad.indexOf(value) === 0,
    width: "6.5rem",
  }, {
    title: 'Dirección',
    dataIndex: 'señas',
    key: 'señas',
  },{
    title: 'Teléfono',
    dataIndex: 'telefono',
    key: 'telefono',
  }, {
    title: 'Sede',
    dataIndex: 'sede',
    key: 'sede',
    filters: [{text: 'Sede en Heredia', value: 'Heredia'}, {text: 'Sede en Desamparados',value: 'Desamparados'}],
    onFilter: (value, record) => record.sede.indexOf(value) === 0,
  },{
    title: 'Acciones',
    key: 'acciones',
    render: (text, row) => <Modal modo="ver" row={row} acceptCaso={this.props.acceptCaso} editCaso={this.props.editCaso}/>,
    fixed: 'right',
    width: "5rem",
  }];


  render() {
    return (
      <div>
      <Row gutter={8} type="flex" justify="end" style={{margin:"1rem 0"}}>
        <Col xs={12} sm={4}>
          <Modal loading={this.props.loading} handleCreate={this.props.createCaso}  modo="crear" />
        </Col>
        <Col xs={12} sm={4}>
          <Descarga seleccionadas={this.state.selectedRows} todos={this.props.casosEspera} />
        </Col>
      </Row>
      <Table rowSelection={this.rowSelection} columns={this.columns} dataSource={this.props.casosEspera} size= "middle" scroll={{ x: "90rem"}} pagination={{ pageSize: 8 }}  />
      </div>
    );
  }

  //Carga casos de espera cuando se carga el componente.
  componentDidMount(){
    this.props.getCasos()
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
    createCaso: (caso,closer)  => dispatch(esperaActions.createCaso(caso,closer)),
    acceptCaso: (caso) => dispatch(esperaActions.acceptCaso(caso)),
    getCasos: (value) => dispatch(esperaActions.getCasos(value)),
    editCaso: (caso, id, reset) => dispatch(esperaActions.editCaso(caso, id, reset)),
  }
}




export default connect(mapStateToProps,mapDispatchToProps)(NormalLoginForm)