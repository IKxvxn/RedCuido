import React from 'react';
import { Form, Input, Select, Button,Row, Col, message, DatePicker, Icon } from 'antd';
import * as Mensajes from '../../assets/mensajes'
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;


class editForm extends React.Component {
  state = {
      edit:true,
      loading:false,
  };
  
  handleSubmit = (handleCreate) => {
    this.props.form.validateFieldsAndScroll((err, caso) => {
      if (!err) {
        if(caso._id === undefined || caso.contraseña === undefined){
            message.error("Debe ingresar al menos usuario y contraseña")
           }
           else {
            const formData = new FormData();  
            formData.append('caso', JSON.stringify(caso))
            formData.append('usuario', JSON.stringify(this.props.usuario))
            handleCreate(formData, this.props.form.resetFields,this.props.usuario)
          }
      }
      else{message.error(Mensajes.verificar)}
    });
  }

  handleDeleteCaso = (deleteCaso) => {
    this.props.form.validateFieldsAndScroll((err, caso) => {
      if (!err) {
        if (caso._id === undefined) {
          message.error(Mensajes.minNecesario)
        }
        else { deleteCaso(this.props.row,this.props.usuario) }
      }
      else { message.error(Mensajes.verificar) }
    });
  }
  
  enterLoading = () => {
    if (this.state.edit === false){
      this.setState({ edit: true});
      message.error(Mensajes.alreadyEditing);
    }
    else{
      this.props.form.validateFieldsAndScroll((err, caso) => {
        if (!err) {
          if (caso._id === undefined) {
            message.error(Mensajes.minNecesario)
          }
          else {
            this.setState({ edit: false });
            const formData = new FormData();
            formData.append('caso', JSON.stringify({ ...caso, _id: this.props.row._id}))
            formData.append('usuario', JSON.stringify(this.props.usuario))
            this.props.editCaso(formData, this.props.visible)
          }
        }
        else { message.error(Mensajes.verificar) }
      });
      
      }
    }
  
    handleOptionsMode() {
      if (this.props.modo === "ver") {
        if (this.state.edit === false) {
          return (
            <Row gutter={8} type="flex" justify="end">
              <Col xs={24} sm={6}><Button icon="edit" onClick={this.enterLoading} loading={this.state.loading} type="primary">Editar</Button></Col>
            </Row>
          )
        } else {
          return (
            <Row gutter={8} type="flex" justify="end">
              <Col xs={24} sm={6}><Button icon="edit" onClick={this.enterLoading} loading={this.state.loading} type="primary">Guardar</Button></Col>
            </Row>
          )
        }
      }
    }
  
  componentDidMount(){
    this.props.onRef(this)
    if(this.props.modo==="ver")
      {this.props.form.setFieldsValue({
          cedula:this.props.row.cedula,
          nombre:this.props.row.nombre,
          ingreso:moment(this.props.row.ingreso),
          telefono:this.props.row.telefono,
          correo:this.props.row.correo,
          _id:this.props.row._id,
          institucion:this.props.row.institucion,
          tipo:this.props.row.tipo,
        })
        this.setState({ edit: false})
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="Cédula"
        >
          {getFieldDecorator('cedula', {
            rules: [{pattern: '^[1-9][0-9]*$', message: Mensajes.cedula}],
          })(<Input disabled={!this.state.edit} />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Nombre"
        >
          {getFieldDecorator('nombre', {
            rules: [{pattern: '^[a-zA-ZÀ-ž ]*$', message: Mensajes.letras}],
          })(
            <Input disabled={!this.state.edit} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Ingreso"
        >
        {getFieldDecorator('ingreso', {
        })(<DatePicker id={"ingreso"} disabled={!this.state.edit}/>
        )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Teléfono"
        >
          {getFieldDecorator('telefono', {
            rules: [{ pattern: '^[0-9]*$', message: Mensajes.numeros }],
          })(
            <Input disabled={!this.state.edit} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Correo"
        >
          {getFieldDecorator('correo', {})(
            <Input disabled={!this.state.edit} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Tipo"
        >
          {getFieldDecorator('tipo',{initialValue:"Administrador"})(
            <Select disabled={!this.state.edit}>
              <Option value="Administrador">Administrador</Option>
              <Option value="Modificador">Modificador</Option>
              <Option value="Espera">Espera</Option>
              <Option value="Observador">Observador</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Institucion"
        >
          {getFieldDecorator('institucion', {})(<Input disabled={!this.state.edit} />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Usuario"
        >
          {getFieldDecorator('_id', {
            rules: [{ required: true, message: 'Ingresa un usuario' }],
          })(<Input disabled={!this.state.edit} />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Password"
        >
          {getFieldDecorator('contraseña', {})(<Input prefix={<Icon type="lock"/>} type="password" disabled={!this.state.edit} />)}
        </FormItem>
        <FormItem>
          {this.handleOptionsMode()}
        </FormItem>
      </Form>
    );
  }
}

const WrappededitForm = Form.create()(editForm);

export default WrappededitForm