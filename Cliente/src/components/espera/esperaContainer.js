import React from 'react';
import { connect } from 'react-redux'
import * as esperaActions from './esperaActions'
import { Table, Row, Col } from 'antd';
import Descarga from '../home/botonDescarga'
import Modal from './esperaModalContainer'
import BarraB from '../barraBusqueda/barraContainer'

var JsSearch = require('js-search');
var dateFormat = require('dateformat');

var busqueda = new JsSearch.Search('_id');
busqueda.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();

busqueda.addIndex('apellidos');
busqueda.addIndex('cedula');
busqueda.addIndex('nombre');
busqueda.addIndex('prioridad');
busqueda.addIndex('p_vivienda');
busqueda.addIndex('p_alimento');
busqueda.addIndex('p_economico');
busqueda.addIndex('p_vive_solo');
busqueda.addIndex('p_otros');
busqueda.addIndex('sede');
busqueda.addIndex('señas');
busqueda.addIndex('telefono');
busqueda.addIndex('_id');

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
    defaultSortOrder: 'ascend',
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
    height: "8rem",
  }, {
    title: 'Prioridad',
    dataIndex: 'prioridad',
    key: 'prioridad',
    render: text => <div className={text+" prioridadFormat"}>{text}</div>,
    filters: [{text: 'Prioridad Alta', value: 'Alta'}, {text: 'Prioridad Media',value: 'Media'},{text: 'Prioridad Baja',value: 'Baja'}],
    onFilter: (value, record) => record.prioridad.indexOf(value) === 0,
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
    render: (text, row) => <Modal modo="ver" usuario={this.props.usuario} row={row} acceptCaso={this.props.acceptCaso} rejectCaso={this.props.rejectCaso} editCaso={this.props.editCaso} downloadFile={this.props.downloadFile}  deleteCaso={this.props.deleteCaso} deleteFiles={this.props.deleteFiles}/>,
    fixed: 'right',
    width: "5rem",
  }];



  render() {
    busqueda.addDocuments(this.props.casosEspera)

    var filter
    if(this.state.filteredWord===""){filter=this.props.casosEspera;this.props.changeCaller("TAB")}
    else{filter = busqueda.search(this.state.filteredWord)}

    return (
      <div>
      <Row gutter={8} type="flex" justify="end" style={{margin:"0.5rem 0"}}>
        <Col xs={12} sm={5} md={4} style={{margin:"0.5rem 0 0 0"}}>
          <Modal loading={this.props.loading} handleCreate={this.props.createCaso} usuario={this.props.usuario}  modo="crear" />
        </Col>
        <Col xs={12} sm={5} md={4} style={{margin:"0.5rem 0 0 0"}}>
          <Descarga seleccionadas={this.state.selectedRows} todos={this.props.casosEspera} lista={"espera"}/>
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
    casosEspera: state.esperaReducer.casosEspera,
    loading: state.esperaReducer.loading,
    usuario: state.loginReducer.usuario
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createCaso: (archivos,closer)  => dispatch(esperaActions.createCaso(archivos,closer)),
    acceptCaso: (caso, nota, usuario) => dispatch(esperaActions.acceptCaso(caso, nota, usuario)),
    rejectCaso: (caso, nota, usuario) => dispatch(esperaActions.rejectCaso(caso, nota, usuario)),
    getCasos: (usuario) => dispatch(esperaActions.getCasos(usuario)),
    editCaso: (caso) => dispatch(esperaActions.editCaso(caso)),
    downloadFile: (caso) => dispatch(esperaActions.downloadFile(caso)),
    deleteCaso: (caso, nota, usuario) => dispatch(esperaActions.deleteCaso(caso, nota, usuario)),
    deleteFiles:(files) => dispatch(esperaActions.deleteFiles(files))
  }
}




export default connect(mapStateToProps,mapDispatchToProps)(NormalLoginForm)