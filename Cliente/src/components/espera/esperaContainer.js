import React from 'react';
import { connect } from 'react-redux'
import * as exampleActions from './esperaActions'
import PropTypes from 'prop-types';
import { Table, Row, Col } from 'antd';
import {columns, data} from './esperaTableModel'
import Descarga from '../home/botonDescarga'


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
  

  render() {
    return (
      <div>
      <Row gutter={8} type="flex" justify="end" style={{margin:"1rem 0"}}>
        <Col xs={24} sm={5}>
          <Descarga seleccionadas={this.state.selectedRows} todos={data} />
        </Col>
      </Row>
      <Table rowSelection={this.rowSelection} columns={columns} dataSource={data} size= "middle" scroll={{ x: "90rem", /*y: 300*/ }} /*pagination={{ pageSize:  }}*/  />
      </div>
    );
  }
}

NormalLoginForm.propTypes = {
  ExampleFunction: PropTypes.func
}

NormalLoginForm.defaultProps = {
  ExampleFunction: () => {}
}

function mapStateToProps(state) {
  return {
    ExapleofData: state.loginReducer.exampleReducer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    ExampleFunction: ()  => dispatch(exampleActions.ExampleFunction())
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(NormalLoginForm)