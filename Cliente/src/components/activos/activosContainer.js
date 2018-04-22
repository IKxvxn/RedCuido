import React from 'react';
import { connect } from 'react-redux'
import * as activosActions from './activosActions'
import { Table, Row, Col, Input } from 'antd';
import Descarga from '../home/botonDescarga'
import Modal from './activosModalContainer'
var dateFormat = require('dateformat');

var JsSearch = require('js-search');
var Search = Input.Search

var busqueda = new JsSearch.Search('_id');
busqueda.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();

busqueda.addIndex('apellidos');
busqueda.addIndex('cedula');
busqueda.addIndex('nombre');
busqueda.addIndex('sede');
busqueda.addIndex('riesgo');
busqueda.addIndex('telefono');



class ActivosForm extends React.Component {
  
  state = {
    selectedRowKeys:[],
    selectedRows:[],
    filteredWord:""
  }

  filtrarCampos = (value) => {
    this.setState({filteredWord:value})
  };
  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.setState({selectedRowKeys:selectedRowKeys,selectedRows:selectedRows})
    },
  };
  
  columns = [{
    title: 'Cedula',
    dataIndex: 'cedula',
    key: 'cedula',
    sorter: (a, b) => (a.cedula === undefined || b.cedula===undefined) ? 0 :Number(a.cedula.charAt(0)) - Number(b.cedula.charAt(0)) , 
  },{
    title: 'Apellidos',
    dataIndex: 'apellidos',
    key: 'apellidos',
    sorter: (a, b) =>  (a.apellidos === undefined) ? "" : a.apellidos.localeCompare(b.apellidos),
  }, {
    title: 'Nombre',
    dataIndex: 'nombre',
    key: 'nombre',
  },{
    title: 'Fecha de Inicio',
    dataIndex: 'inicio',
    key: 'inicio',
    render: (text) => <span>{dateFormat(new Date(text),"dd-mm-yyyy")}</span>,
    sorter: (a, b) => new Date(b.inicio) - new Date(a.inicio), 
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
    render: (text, row) => <Modal modo="ver" row={row} excludeCaso={this.props.excludeCaso} editCaso={this.props.editCaso}/>,
    fixed: 'right',
    width: "5rem",
  }];


  render() {
    return (
      <div>
      <Row gutter={8} type="flex" justify="end" style={{margin:"0.5rem 0"}}>
        <Col xs={12} sm={4} style={{margin:"0.5rem 0 0 0"}}>
          <Modal loading={this.props.loading} handleCreate={this.props.activarCaso} modo="activar" />
        </Col>
        <Col xs={12} sm={4} style={{margin:"0.5rem 0 0 0"}}>
          <Descarga seleccionadas={this.state.selectedRows} todos={this.props.casosActivos} />
        </Col>
        <Col xs={24} sm={16} style={{margin:"0.5rem 0 0 0"}}>
          <Search  placeholder="Escriba aquí la información que desea buscar" enterButton onSearch={value => this.filtrarCampos(value)}/>
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
    editCaso: (caso, reset) => dispatch(activosActions.editCaso(caso, reset)),
    excludeCaso: (caso, nota) => dispatch(activosActions.excludeCaso(caso, nota)),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ActivosForm)