import React from 'react';
import { connect } from 'react-redux'
import * as esperaActions from './esperaActions'
import { Table, Row, Col, Input } from 'antd';
import Descarga from '../home/botonDescarga'
import Modal from './esperaModalContainer'

var JsSearch = require('js-search');
var dateFormat = require('dateformat');
var Search = Input.Search

var busqueda = new JsSearch.Search('_id');
busqueda.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();

busqueda.addIndex('apellidos');
busqueda.addIndex('cedula');
busqueda.addIndex('nombre');
busqueda.addIndex('prioridad');
busqueda.addIndex('problemas');
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
    render: (text, row) => <Modal modo="ver" row={row} acceptCaso={this.props.acceptCaso} rejectCaso={this.props.rejectCaso} editCaso={this.props.editCaso}/>,
    fixed: 'right',
    width: "5rem",
  }];



  render() {
    
    busqueda.addDocuments(this.props.casosEspera)

    var filter
    if(this.state.filteredWord===""){filter=this.props.casosEspera}
    else{filter = busqueda.search(this.state.filteredWord)}

    console.log(filter)

    return (
      <div>
      <Row gutter={8} type="flex" justify="end" style={{margin:"0.5rem 0"}}>
        <Col xs={12} sm={4} style={{margin:"0.5rem 0 0 0"}}>
          <Modal loading={this.props.loading} handleCreate={this.props.createCaso}  modo="crear" />
        </Col>
        <Col xs={12} sm={4} style={{margin:"0.5rem 0 0 0"}}>
          <Descarga seleccionadas={this.state.selectedRows} todos={this.props.casosEspera} />
        </Col>
        <Col xs={24} sm={16} style={{margin:"0.5rem 0 0 0"}}>
          <Search  placeholder="Escriba aquí la información que desea buscar" enterButton onSearch={value => this.filtrarCampos(value)}/>
        </Col>
        
      </Row>

      <Table rowSelection={this.rowSelection} columns={this.columns} dataSource={filter} size= "middle" scroll={{ x: "90rem"}} pagination={{ pageSize: 8 }}  />
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
    createCaso: (archivos,closer)  => dispatch(esperaActions.createCaso(archivos,closer)),
    acceptCaso: (caso, nota) => dispatch(esperaActions.acceptCaso(caso, nota)),
    rejectCaso: (caso, nota) => dispatch(esperaActions.rejectCaso(caso, nota)),
    getCasos: (value) => dispatch(esperaActions.getCasos(value)),
    editCaso: (caso, reset) => dispatch(esperaActions.editCaso(caso, reset)),
  }
}




export default connect(mapStateToProps,mapDispatchToProps)(NormalLoginForm)