import React from 'react';
import { connect } from 'react-redux'
import * as userActions from './usersActions'
import { Table, Row, Col, Input } from 'antd';
import Descarga from '../home/botonDescarga'
import Modal from './usersModalContainer'
var dateFormat = require('dateformat');

var JsSearch = require('js-search');
var Search = Input.Search

var busqueda = new JsSearch.Search('_id');
busqueda.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();

busqueda.addIndex('cedula');
busqueda.addIndex('nombre');
busqueda.addIndex('telefono');
busqueda.addIndex('institucion');
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
  }, {
    title: 'Usuario',
    dataIndex: '_id',
    key: '_id',
    sorter: (a, b) =>  (a._id === undefined) ? "" : a._id.localeCompare(b._id),
  }, {
    title: 'Nombre',
    dataIndex: 'nombre',
    key: 'nombre',
    sorter: (a, b) =>  (a.nombre === undefined) ? "" : a.nombre.localeCompare(b.nombre),
  }, {
    title: 'Tipo',
    dataIndex: 'tipo',
    key: 'tipo',
    sorter: (a, b) =>  (a.tipo === undefined) ? "" : a.tipo.localeCompare(b.tipo),
  },{
    title: 'Teléfono',
    dataIndex: 'telefono',
    key: 'telefono',
  },{
    title: 'Acciones',
    key: 'acciones',
    render: (text, row) => <Modal modo="ver"usuario={this.props.usuario} row={row} editCaso={this.props.editCaso} deleteCaso={this.props.deleteCaso} />,
    fixed: 'right',
    width: "5rem",
  }];

  
  render() {

    busqueda.addDocuments(this.props.casosUser)

    var filter
    if(this.state.filteredWord===""){filter=this.props.casosUser}
    else{filter = busqueda.search(this.state.filteredWord)}

    return (
      <div>
        <Row gutter={8} type="flex" justify="end" style={{margin:"0.5rem 0"}}>
          <Col xs={12} sm={4} style={{margin:"0.5rem 0 0 0"}}>
            <Modal usuario={this.props.usuario} loading={this.props.loading} handleCreate={this.props.createCaso}  modo="crear" />
          </Col>
          <Col xs={36} sm={20} style={{margin:"0.5rem 0 0 0"}}>
            <Search  placeholder="Escriba aquí la información que desea buscar" enterButton onSearch={value => this.filtrarCampos(value)}/>
          </Col>
        </Row>
        <Table loading={this.props.loading} rowSelection={this.rowSelection} columns={this.columns} dataSource={filter} size= "middle" scroll={{ x: "90rem"}} pagination={{ pageSize: 8 }}  />
      </div>
    );
  }

  //Carga users cuando se carga el componente.
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
    casosUser: state.userReducer.casosUser,
    loading: state.userReducer.loading,
    usuario: state.loginReducer.usuario
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createCaso: (caso,closer, usuario)  => dispatch(userActions.createCaso(caso,closer,usuario)),
    getCasos: (usuario) => dispatch(userActions.getCasos(usuario)),
    editCaso: (caso, reset,usuario) => dispatch(userActions.editCaso(caso, reset,usuario)),
    deleteCaso: (caso, usuario) => dispatch(userActions.deleteCaso(caso, usuario)),
  }
}




export default connect(mapStateToProps,mapDispatchToProps)(NormalLoginForm)