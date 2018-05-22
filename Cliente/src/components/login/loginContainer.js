import React from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { Form, Icon, Input, Button, Row, Layout  } from 'antd';

import * as Mensajes from '../../assets/mensajes'
import logo from '../../images/logo.png'
import '../../style/login.css'
import * as loginActions from './loginActions'

const FormItem = Form.Item;

class loginContainer extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, usuario) => {
      if (!err) {
        this.props.ingresar(usuario,this.props.history)
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Layout  className="formContainer">
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem className="logo">
            <img alt="logo" src={logo} />
            <span>Red de Cuido C.R.</span>
          </FormItem>
          <FormItem>
            {getFieldDecorator('usuario', {
              rules: [{ required: true, message: Mensajes.requerido }],
            })(
              <Input prefix={<Icon type="user" style={{ color: '#007A3B' }} />} placeholder="Usuario" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('contraseña', {
              rules: [{ required: true, message: Mensajes.requerido }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: '#007A3B' }} />} type="password" placeholder="Contraseña" />
            )}
          </FormItem>
          <Row>
            <Button onClick = {this.handleSubmit} type="primary"  htmlType="submit" className="login-form-button" >
              Ingresar
            </Button>
          
          </Row>
            
        </Form>
      </Layout >
    );
  }
}

loginContainer.propTypes = {
  ingresar: PropTypes.func
}

loginContainer.defaultProps = {
  ingresar: () => {}
}

function mapStateToProps(state) {
  return {
    ExapleofData: state.loginReducer.exampleReducer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    ingresar: (usuario,history)  => dispatch(loginActions.ingresar(usuario,history))
  }
}

const WrappedloginContainer = Form.create()(loginContainer);
export default connect(mapStateToProps,mapDispatchToProps)(WrappedloginContainer)