import React from 'react';
import { connect } from 'react-redux'
import * as activosActions from './activosActions'
import { Table, Row, Col } from 'antd';
import Descarga from '../home/botonDescarga'
import Modal from './activosModalContainer'
import BarraB from '../barraBusqueda/barraContainer'

var dateFormat = require('dateformat');

var JsSearch = require('js-search');

var busqueda = new JsSearch.Search('_id');
busqueda.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();

busqueda.addIndex('apellidos');
busqueda.addIndex('cedula');
busqueda.addIndex('nombre');
busqueda.addIndex('sede');
busqueda.addIndex('riesgo');
busqueda.addIndex('telefono');
busqueda.addIndex('alternativas');
busqueda.addIndex('_id');


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
    render: (text, row) => <Modal usuario={this.props.usuario} modo="ver" row={row} excludeCaso={this.props.excludeCaso} editCaso={this.props.editCaso}  deleteCaso={this.props.deleteCaso} downloadFile={this.props.downloadFile} deleteFiles={this.props.deleteFiles}/>,
    fixed: 'right',
    width: "5rem",
  }];


  render() {
    busqueda.addDocuments(this.props.casosActivos)

    var filter
    if(this.state.filteredWord===""){filter=this.props.casosActivos;this.props.changeCaller("TAB")}
    else{filter = busqueda.search(this.state.filteredWord)}
    
    return (
      <div>
      <Row gutter={8} type="flex" justify="end" style={{margin:"0.5rem 0"}}>
        <Col xs={12} sm={5} md={4} style={{margin:"0.5rem 0 0 0"}}>
          <Modal usuario={this.props.usuario} loading={this.props.loading} handleCreate={this.props.activarCaso} modo="activar" />
        </Col>
        <Col xs={12} sm={5} md={4} style={{margin:"0.5rem 0 0 0"}}>
          <Descarga seleccionadas={this.state.selectedRows} todos={this.props.casosActivos} lista={"activos"}/>
        </Col>
        <Col xs={24} sm={14} md={16} style={{margin:"0.5rem 0 0 0"}}>
          <BarraB query={this.props.query} getFiltered={this.props.getFiltered} filtro={this.props.filtro} usuario={this.props.usuario} filtrarCampos={this.filtrarCampos} changeId={this.props.changeId} changeCaller={this.props.changeCaller}/>
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
    if(NextProps.caller!==this.props.caller||NextProps.searchID!==this.props.searchID){
      this.setState({filteredWord:NextProps.searchID})
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
    activarCaso: (caso,closer)  => dispatch(activosActions.activarCaso(caso,closer)),
    getCasos: (usuarios) => dispatch(activosActions.getCasos(usuarios)),
    editCaso: (caso, reset,usuario) => dispatch(activosActions.editCaso(caso, reset, usuario)),
    excludeCaso: (caso, nota, usuario) => dispatch(activosActions.excludeCaso(caso, nota, usuario)),
    downloadFile: (caso) => dispatch(activosActions.downloadFile(caso)),
    deleteCaso: (caso, nota, usuario) => dispatch(activosActions.deleteCaso(caso, nota, usuario)),
    deleteFiles:(files) => dispatch(activosActions.deleteFiles(files))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ActivosForm)