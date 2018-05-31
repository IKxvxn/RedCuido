import React from 'react';
import { connect } from 'react-redux'
import * as excluidosActions from './excluidosActions'
import { Table, Row, Col } from 'antd';
import Descarga from '../home/botonDescarga'
import Modal from './excluidosModalContainer'
import BarraB from '../barraBusqueda/barraContainer'

var dateFormat = require('dateformat');

var JsSearch = require('js-search');

var busqueda = new JsSearch.Search('_id');
busqueda.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();

//se definen los datos a usar en la búsqueda
busqueda.addIndex('apellidos');
busqueda.addIndex('cedula');
busqueda.addIndex('nombre');
busqueda.addIndex('sede');
busqueda.addIndex('señas');
busqueda.addIndex('telefono');
busqueda.addIndex('_id');



class NormalLoginForm extends React.Component {
  //variables de filas seleccionadas  
  state = {
    selectedRowKeys:[],
    selectedRows:[],
    filteredWord:""
  }
  //filtrar campos de la tabla
  filtrarCampos = (value) => {
    this.setState({filteredWord:value})
  };
  //seleccionar las filas
  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.setState({selectedRowKeys:selectedRowKeys,selectedRows:selectedRows})
    },
  };
  //definir las columnas de la tabla y los filtros para ordenas
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
    render: (text, row) => <Modal usuario={this.props.usuario} modo="ver" row={row} reactivateCaso={this.props.reactivateCaso}  editCaso={this.props.editCaso} deleteCaso={this.props.deleteCaso} downloadFile={this.props.downloadFile} deleteFiles={this.props.deleteFiles}/>,
    fixed: 'right',
    width: "5rem",
  }];

  
  render() {
    busqueda.addDocuments(this.props.casosExcluidos)
    //inicializa el filtro de ordenamiento
    var filter
    if(this.state.filteredWord===""){filter=this.props.casosExcluidos;this.props.changeCaller("TAB")}
    else{filter = busqueda.search(this.state.filteredWord)}
    //establece la estructura del container
    return (
      <div>
        <Row gutter={8} type="flex" justify="end" style={{margin:"0.5rem 0"}}>
          <Col xs={12} sm={5} md={4} style={{margin:"0.5rem 0 0 0"}}>
            <Modal usuario={this.props.usuario} loading={this.props.loading} handleCreate={this.props.createCaso}  modo="crear" />
          </Col>
          <Col xs={12} sm={5} md={4} style={{margin:"0.5rem 0 0 0"}}>
            <Descarga seleccionadas={this.state.selectedRows} todos={this.props.casosExcluidos} lista={"excluidos"}/>
          </Col>
          <Col xs={24} sm={14} md={16} style={{margin:"0.5rem 0 0 0"}}>
            <BarraB query={this.props.query} getFiltered={this.props.getFiltered} filtro={this.props.filtro} usuario={this.props.usuario} filtrarCampos={this.filtrarCampos} changeId={this.props.changeId} changeCaller={this.props.changeCaller}/>
          </Col>
        </Row>
        <Table loading={this.props.loading} rowSelection={this.rowSelection} columns={this.columns} dataSource={filter} size= "middle" scroll={{ x: "90rem"}} pagination={{ pageSize: 8 }}  />
      </div>
    );
  }

  //Carga casos de excluidos cuando se carga el componente.
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
  //variables del reducer
  return {
    casosExcluidos: state.excluidosReducer.casosExcluidos,
    loading: state.excluidosReducer.loading,
    usuario: state.loginReducer.usuario
  } 
}

function mapDispatchToProps(dispatch) {
  //funciones que realizan las acciones de excluidosActions
  return {
    createCaso: (caso, closer, usuario)  => dispatch(excluidosActions.createCaso(caso,closer, usuario)),
    getCasos: (usuario) => dispatch(excluidosActions.getCasos(usuario)),
    editCaso: (caso, usuario) => dispatch(excluidosActions.editCaso(caso, usuario)),
    reactivateCaso: (caso, nota, usuario) => dispatch(excluidosActions.reactivateCaso(caso, nota, usuario)),
    downloadFile: (caso) => dispatch(excluidosActions.downloadFile(caso)),
    deleteCaso: (caso, nota, usuario) => dispatch(excluidosActions.deleteCaso(caso, nota, usuario)),
    deleteFiles:(files) => dispatch(excluidosActions.deleteFiles(files))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(NormalLoginForm)