import React from 'react';
import { connect } from 'react-redux'
import * as excluidosActions from './excluidosActions'
import { Table, Row, Col } from 'antd';
import Descarga from '../home/botonDescarga'
import Modal from './excluidosModalContainer'
var dateFormat = require('dateformat');



class NormalLoginForm extends React.Component {
  
  state = {
    selectedRowKeys:[],
    selectedRows:[]
  }

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.setState({selectedRowKeys:selectedRowKeys,selectedRows:selectedRows})
    },
  };

  columns = [{
    title: 'Cedula',
    dataIndex: 'cedula',
    key: 'cedula',
    sorter: (a, b) => Number(a.cedula.charAt(0)) - Number(b.cedula.charAt(0)) , 
  },{
    title: 'Apellidos',
    dataIndex: 'apellidos',
    key: 'apellidos',
    sorter: (a, b) => a.apellidos.localeCompare(b.apellidos),
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
    title: 'Fecha Ingreso',
    dataIndex: 'ingreso',
    key: 'ingreso',
    render: (text) => <span>{dateFormat(new Date(text),"dd-mm-yyyy")}</span>,
    sorter: (a, b) => new Date(b.ingreso) - new Date(a.ingreso), 
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
    render: (text, row) => <Modal modo="ver" row={row} reactivateCaso={this.props.reactivateCaso}  editCaso={this.props.editCaso}/>,
    fixed: 'right',
    width: "5rem",
  }];

  
  render() {
    return (
      <div>
        <Row gutter={8} type="flex" justify="end" style={{margin:"1rem 0"}}>
          <Col xs={12} sm={4}>
            <Modal loading={this.props.loading} handleCreate={this.props.createCaso}  modo="crear" />
          </Col>
          <Col xs={12} sm={4}>
            <Descarga seleccionadas={this.state.selectedRows} todos={this.props.casosExcluidos} />
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
    createCaso: (caso,closer)  => dispatch(excluidosActions.createCaso(caso,closer)),
    getCasos: (value) => dispatch(excluidosActions.getCasos(value)),
    editCaso: (caso, reset) => dispatch(excluidosActions.editCaso(caso, reset)),
    reactivateCaso: (caso, nota) => dispatch(excluidosActions.reactivateCaso(caso, nota)),
  }
}




export default connect(mapStateToProps,mapDispatchToProps)(NormalLoginForm)