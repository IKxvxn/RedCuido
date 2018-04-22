import React from 'react';
import { connect } from 'react-redux'
import * as excluidosActions from './excluidosActions'
import { Table, Row, Col, Input } from 'antd';
import Descarga from '../home/botonDescarga'
import Modal from './excluidosModalContainer'
var dateFormat = require('dateformat');

var JsSearch = require('js-search');
var Search = Input.Search

var busqueda = new JsSearch.Search('_id');
busqueda.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();

busqueda.addIndex('apellidos');
busqueda.addIndex('cedula');
busqueda.addIndex('nombre');
busqueda.addIndex('sede');
busqueda.addIndex('señas');
busqueda.addIndex('telefono');



class NormalLoginForm extends React.Component {
  
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
    sorter: (a, b) => (a.apellidos === undefined) ? "" : a.apellidos.localeCompare(b.apellidos),
  }, {
    title: 'Nombre',
    dataIndex: 'nombre',
    key: 'nombre',
  },{
    title: 'Fecha Exclusion',
    dataIndex: 'exclusion',
    key: 'exclusion',
    render: (text) => <span>{dateFormat(new Date(text),"dd-mm-yyyy")}</span>,
    sorter: (a, b) => new Date(b.exclusion) - new Date(a.exclusion), 
  }, {
    title: 'Fecha Inicio',
    dataIndex: 'inicio',
    key: 'inicio',
    render: (text) => <span>{dateFormat(new Date(text),"dd-mm-yyyy")}</span>,
    sorter: (a, b) => new Date(b.inicio) - new Date(a.inicio), 
  },{
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
    filters: [{text: 'Sede en Heredia', value: 'Heredia'}, {text: 'Sede en Desamparados', value: 'Desamparados'}],
    onFilter: (value, record) => record.sede.indexOf(value) === 0,
  },{
    title: 'Acciones',
    key: 'acciones',
    render: (text, row) => <Modal modo="ver" row={row} reactivateCaso={this.props.reactivateCaso}  editCaso={this.props.editCaso} deleteCaso={this.props.deleteCaso}/>,
    fixed: 'right',
    width: "5rem",
  }];

  
  render() {
    return (
      <div>
        <Row gutter={8} type="flex" justify="end" style={{margin:"0.5rem 0"}}>
          <Col xs={12} sm={4} style={{margin:"0.5rem 0 0 0"}}>
            <Modal loading={this.props.loading} handleCreate={this.props.createCaso}  modo="crear" />
          </Col>
          <Col xs={12} sm={4} style={{margin:"0.5rem 0 0 0"}}>
            <Descarga seleccionadas={this.state.selectedRows} todos={this.props.casosExcluidos} />
          </Col>
          <Col xs={24} sm={16} style={{margin:"0.5rem 0 0 0"}}>
            <Search  placeholder="Escriba aquí la información que desea buscar" enterButton onSearch={value => this.filtrarCampos(value)}/>
          </Col>
        </Row>
        <Table rowSelection={this.rowSelection} columns={this.columns} dataSource={this.props.casosExcluidos} size= "middle" scroll={{ x: "90rem"}} pagination={{ pageSize: 8 }}  />
      </div>
    );
  }

  //Carga casos de excluidos cuando se carga el componente.
  componentDidMount(){
    this.props.getCasos()
  }
}


function mapStateToProps(state) {
  return {
    casosExcluidos: state.excluidosReducer.casosExcluidos,
    loading: state.excluidosReducer.loading
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createCaso: (caso, closer)  => dispatch(excluidosActions.createCaso(caso,closer)),
    getCasos: (value) => dispatch(excluidosActions.getCasos(value)),
    editCaso: (caso, reset) => dispatch(excluidosActions.editCaso(caso, reset)),
    reactivateCaso: (caso, nota) => dispatch(excluidosActions.reactivateCaso(caso, nota)),
    deleteCaso: (caso, nota) => dispatch(excluidosActions.deleteCaso(caso, nota)),
  }
}




export default connect(mapStateToProps,mapDispatchToProps)(NormalLoginForm)