import React from 'react';
import { connect } from 'react-redux'
import * as rechazadosActions from './rechazadosActions'
import { Table, Row, Col } from 'antd';
import Descarga from '../home/botonDescarga'
import Modal from './rechazadosModalContainer'
import BarraB from '../barraBusqueda/barraContainer'

var dateFormat = require('dateformat');

var JsSearch = require('js-search');

var busqueda = new JsSearch.Search('_id');
busqueda.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();

//instancia los datos que seran usados en el buscador
busqueda.addIndex('apellidos');
busqueda.addIndex('cedula');
busqueda.addIndex('nombre');
busqueda.addIndex('sede');
busqueda.addIndex('señas');
busqueda.addIndex('telefono');
busqueda.addIndex('_id');


class NormalLoginForm extends React.Component {
  //variables que almacenan las filas seleccionadas
  state = {
    selectedRowKeys:[],
    selectedRows:[],
    filteredWord:""
  }
  //define los filtros
  filtrarCampos = (value) => {
    this.setState({filteredWord:value})
  };
  //define la seleccion de filas
  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.setState({selectedRowKeys:selectedRowKeys,selectedRows:selectedRows})
    },
  };
  //establece las columnas junto con los filtros de ordenamiento de la tabla
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
    title: 'Fecha Rechazo',
    dataIndex: 'rechazo',
    key: 'rechazo',
    render: (text) => <span>{dateFormat(new Date(text),"dd-mm-yyyy")}</span>,
    sorter: (a, b) => new Date(b.rechazo) - new Date(a.rechazo), 
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
    filters: [{text: 'Sede en Heredia', value: 'Heredia'}, {text: 'Sede en Desamparados', value: 'Desamparados'}],
    onFilter: (value, record) => record.sede.indexOf(value) === 0,
  },{
    title: 'Acciones',
    key: 'acciones',
    render: (text, row) => <Modal modo="ver"usuario={this.props.usuario} row={row} reactivateCaso={this.props.reactivateCaso} editCaso={this.props.editCaso} deleteCaso={this.props.deleteCaso} downloadFile={this.props.downloadFile} deleteFiles={this.props.deleteFiles}/>,
    fixed: 'right',
    width: "5rem",
  }];

  
  render() {
    busqueda.addDocuments(this.props.casosRechazados)
    //establece los filtros de la tabla
    var filter
    if(this.state.filteredWord===""){filter=this.props.casosRechazados;this.props.changeCaller("TAB")}
    else{filter = busqueda.search(this.state.filteredWord)}
  //define la estructura del container (tabla)
    return (
      <div>
        <Row gutter={8} type="flex" justify="end" style={{margin:"0.5rem 0"}}>
          <Col xs={12} sm={5} md={4} style={{margin:"0.5rem 0 0 0"}}>
            <Modal usuario={this.props.usuario} loading={this.props.loading} handleCreate={this.props.createCaso}  modo="crear" />
          </Col>
          <Col xs={12} sm={5} md={4} style={{margin:"0.5rem 0 0 0"}}>
            <Descarga seleccionadas={this.state.selectedRows} todos={this.props.casosRechazados} lista={"rechazados"}/>
          </Col>
          <Col xs={24} sm={14} md={16} style={{margin:"0.5rem 0 0 0"}}>
            <BarraB query={this.props.query} getFiltered={this.props.getFiltered} filtro={this.props.filtro} usuario={this.props.usuario} filtrarCampos={this.filtrarCampos} changeId={this.props.changeId} changeCaller={this.props.changeCaller}/>
          </Col>
        </Row>
        <Table loading={this.props.loading} rowSelection={this.rowSelection} columns={this.columns} dataSource={filter} size= "middle" scroll={{ x: "90rem"}} pagination={{ pageSize: 8 }}  />
      </div>
    );
  }

  //Carga casos de rechazados cuando se carga el componente.
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

//variables utilizadas en el reducer
function mapStateToProps(state) {
  return {
    casosRechazados: state.rechazadosReducer.casosRechazados,
    loading: state.rechazadosReducer.loading,
    usuario: state.loginReducer.usuario
  }
}

//funciones que comunican con rechazadosActions para realizar modificaiones a la BD
function mapDispatchToProps(dispatch) {
  return {
    createCaso: (caso,closer, usuario)  => dispatch(rechazadosActions.createCaso(caso,closer,usuario)),
    getCasos: (usuario) => dispatch(rechazadosActions.getCasos(usuario)),
    editCaso: (caso, usuario) => dispatch(rechazadosActions.editCaso(caso, usuario)),
    reactivateCaso: (caso, nota,usuario) => dispatch(rechazadosActions.reactivateCaso(caso, nota,usuario)),
    downloadFile: (caso) => dispatch(rechazadosActions.downloadFile(caso)),
    deleteCaso: (caso, nota, usuario) => dispatch(rechazadosActions.deleteCaso(caso, nota, usuario)),
    deleteFiles:(files) => dispatch(rechazadosActions.deleteFiles(files))
  }
}




export default connect(mapStateToProps,mapDispatchToProps)(NormalLoginForm)