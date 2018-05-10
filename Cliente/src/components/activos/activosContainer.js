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
busqueda.addIndex('alternativas');


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
    render: (text, row) => <Modal usuario={this.props.usuario} modo="ver" row={row} excludeCaso={this.props.excludeCaso} editCaso={this.props.editCaso}  deleteCaso={this.props.deleteCaso}/>,
    fixed: 'right',
    width: "5rem",
  }];


  render() {
    busqueda.addDocuments(this.props.casosActivos)

    var filter
    if(this.state.filteredWord===""){filter=this.props.casosActivos}
    else{filter = busqueda.search(this.state.filteredWord)}
    
    return (
      <div>
      <Row gutter={8} type="flex" justify="end" style={{margin:"0.5rem 0"}}>
        <Col xs={12} sm={4} style={{margin:"0.5rem 0 0 0"}}>
          <Modal usuario={this.props.usuario} loading={this.props.loading} handleCreate={this.props.activarCaso} modo="activar" />
        </Col>
        <Col xs={12} sm={4} style={{margin:"0.5rem 0 0 0"}}>
          <Descarga seleccionadas={this.state.selectedRows} todos={this.props.casosActivos} lista={"activos"}/>
        </Col>
        <Col xs={24} sm={16} style={{margin:"0.5rem 0 0 0"}}>
          <Search  placeholder="Escriba aquí la información que desea buscar" enterButton onSearch={value => this.filtrarCampos(value)}/>
        </Col>
      </Row>
      <Table loading={this.props.loading} rowSelection={this.rowSelection} columns={this.columns} dataSource={filter} size= "middle" scroll={{ x: "90rem"}} pagination={{ pageSize: 8 }}  />
      </div>
    );
  }

   //Carga casos de espera cuando se carga el componente.
   componentDidMount(){
    this.props.getCasos(this.props.usuario)
  }

  componentWillReceiveProps(NextProps) {
    if(NextProps.usuario.token!==this.props.usuario.token){
      this.props.getCasos(NextProps.usuario)
    }
  }
}


function mapStateToProps(state) {
  return {
    casosActivos: state.activosReducer.casosActivos,
    loading: state.activosReducer.loading,
    usuario: state.loginReducer.usuario
  }
}

function mapDispatchToProps(dispatch) {
  return {
    activarCaso: (caso,closer,usuario)  => dispatch(activosActions.activarCaso(caso,closer,usuario)),
    getCasos: (usuarios) => dispatch(activosActions.getCasos(usuarios)),
    editCaso: (caso, reset,usuario) => dispatch(activosActions.editCaso(caso, reset, usuario)),
    excludeCaso: (caso, nota, usuario) => dispatch(activosActions.excludeCaso(caso, nota, usuario)),
    deleteCaso: (caso, nota, usuario) => dispatch(activosActions.deleteCaso(caso, nota, usuario)),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ActivosForm)