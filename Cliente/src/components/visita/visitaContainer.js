import React from 'react';
import { connect } from 'react-redux'
import * as visitaActions from './visitaActions'
import { Table, Row, Col, Input } from 'antd';
import Descarga from '../home/botonDescarga'
import Modal from './visitaModalContainer'

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
busqueda.addIndex('alternativas');
busqueda.addIndex('riesgo');
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
    render: (text, row) => <Modal modo="ver" usuario={this.props.usuario} row={row} acceptCaso={this.props.acceptCaso} rejectCaso={this.props.rejectCaso} editCaso={this.props.editCaso} downloadFile={this.props.downloadFile} deleteCaso={this.props.deleteCaso} deleteFiles={this.props.deleteFiles}/>,
    fixed: 'right',
    width: "5rem",
  }];



  render() {
    
    busqueda.addDocuments(this.props.casosVisita)

    var filter
    if(this.state.filteredWord===""){filter=this.props.casosVisita}
    else{filter = busqueda.search(this.state.filteredWord)}
    return (
      <div>
      <Row gutter={8} type="flex" justify="end" style={{margin:"0.5rem 0"}}>
        <Col xs={12} sm={4} style={{margin:"0.5rem 0 0 0"}}>
          <Modal usuario={this.props.usuario} loading={this.props.loading} handleCreate={this.props.createCaso}  modo="crear" />
        </Col>
        <Col xs={12} sm={4} style={{margin:"0.5rem 0 0 0"}}>
          <Descarga seleccionadas={this.state.selectedRows} todos={this.props.casosVisita} lista={"visitados"}/>
        </Col>
        <Col xs={24} sm={16} style={{margin:"0.5rem 0 0 0"}}>
          <Search  placeholder="Escriba aquí la información que desea buscar" enterButton onSearch={value => this.filtrarCampos(value)}/>
        </Col>
        
      </Row>

      <Table loading={this.props.loading} rowSelection={this.rowSelection} columns={this.columns} dataSource={filter} size= "middle" scroll={{ x: "90rem"}} pagination={{ pageSize: 8 }}  />
      </div>
    );
  }

  //Carga casos de visita cuando se carga el componente.
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
    casosVisita: state.visitaReducer.casosVisita,
    loading: state.visitaReducer.loading,
    usuario: state.loginReducer.usuario
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createCaso: (archivos,closer)  => dispatch(visitaActions.createCaso(archivos,closer)),
    acceptCaso: (caso, nota, usuario) => dispatch(visitaActions.acceptCaso(caso, nota, usuario)),
    rejectCaso: (caso, nota, usuario) => dispatch(visitaActions.rejectCaso(caso, nota, usuario)),
    getCasos: (usuario) => dispatch(visitaActions.getCasos(usuario)),
    editCaso: (caso, reset) => dispatch(visitaActions.editCaso(caso, reset)),
    downloadFile: (caso) => dispatch(visitaActions.downloadFile(caso)),
    deleteCaso: (caso, nota, usuario) => dispatch(visitaActions.deleteCaso(caso, nota, usuario)),
    deleteFiles: (files) => dispatch(visitaActions.deleteFiles(files))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(NormalLoginForm)