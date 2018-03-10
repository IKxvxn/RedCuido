import React from 'react';
import { connect } from 'react-redux'
import * as exampleActions from './esperaActions'
import PropTypes from 'prop-types';
import { Table } from 'antd';
import {columns, data} from './esperaTableModel'


const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
};


class NormalLoginForm extends React.Component {
  
  render() {
    return (
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} size= "middle" scroll={{ x: "80rem", /*y: 300*/ }} /*pagination={{ pageSize:  }}*/  />
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