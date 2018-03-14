import React from 'react';
import { Form, Input, Cascader, Select, Button,Row, Col, message } from 'antd';
import * as Mensajes from '../../assets/mensajes'
const domicilios =  require('../../assets/divisionCR.json').provincias
const FormItem = Form.Item;
const Option = Select.Option;


class editForm extends React.Component {
  state = {
      edit:true,
      loading:false,
  };
  handleSubmit = (e) => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(values.cedula === undefined && (values.nombre === undefined || values.apellidos === undefined) 
           && values.señas === undefined && values.telefono === undefined){
            message.error(Mensajes.minNecesario)
           }
        else{console.log('Received values of form: ', values);}
      }
      else{message.error(Mensajes.verificar)}
    });
  }
  enterLoading = () => {
      this.setState({ edit: true});
      message.error(Mensajes.alreadyEditing);
    }
  
  handleOptionsMode(){
    if(this.props.modo==="ver"){
      return(
        <Row gutter={8}>
            <Col xs={24} sm={6}><Button icon="edit"  onClick={this.enterLoading} loading={this.state.loading} type="primary">Editar</Button></Col>
            <Col xs={12} sm={9}>
                      <Button icon="upload" type="secondary">Subir Archivo</Button>
            </Col>
            <Col xs={12} sm={9}>
                      <Button icon="download" type="secondary">Bajar Archivos</Button>
           </Col>
        </Row>
      )
    }
    return(
      <Row gutter={8} type="flex" justify="end">
          <Col xs={24} sm={20}>
            <Button icon="upload" type="secondary">Subir Archivo</Button>
          </Col>
      </Row>
    )
  }
  
  componentDidMount(){
    this.props.onRef(this)
    if(this.props.modo==="ver")
      {this.props.form.setFieldsValue({
          cedula:this.props.row.cedula,
          nombre:this.props.row.nombre,
          apellidos:this.props.row.apellidos,
          telefono:this.props.row.telefono,
          domicilio:this.props.row.domicilio,
          señas:this.props.row.direccion,
          sede:this.props.row.sede,
          prioridad:this.props.row.prioridad,
          problemas:this.props.row.problemas,
          notas:this.props.row.notas
      })
      this.setState({edit:false})
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
          label="Apellidos"
        >
          {getFieldDecorator('apellidos', {
            rules: [{pattern: '^[a-zA-ZÀ-ž ]*$', message: Mensajes.letras}],
          })(
            <Input disabled={!this.state.edit} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Domicilio"
          extra="La búsqueda es sensible a las mayúsculas."
        >
          {getFieldDecorator('domicilio', {
            initialValue:[0],
            rules: [{ type: 'array', required: true, message: Mensajes.desconocido}],
          })(
            <Cascader disabled={!this.state.edit} options={domicilios} placeholder="" changeOnSelect showSearch notFoundContent="No encontrado" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Señas"
        >
          {getFieldDecorator('señas')(
            <Input.TextArea Rows={2} maxRows={2} disabled={!this.state.edit} />
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
          label="Problemas"
        >
          {getFieldDecorator('problemas')(
            <Select mode="multiple" disabled={!this.state.edit}>
              <Option value="Vivienda">Vivienda</Option>
              <Option value="Alimentarios">Alimentarios</Option>
              <Option value="Económicos">Económicos</Option>
              <Option value="Vive Solo">Vive Solo</Option>
              <Option value="Otros">Otros</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Sede"
        >
          {getFieldDecorator('sede',{initialValue:"Desamparados"})(
            <Select disabled={!this.state.edit}>
              <Option value="Desamparados">Desamparados</Option>
              <Option value="Heredia">Heredia</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Prioridad"
        >
          {getFieldDecorator('prioridad',{initialValue:"Baja"})(
            <Select disabled={!this.state.edit}>
              <Option value="Alta">Alta</Option>
              <Option value="Media">Media</Option>
              <Option value="Baja">Baja</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Notas"
        >
          {getFieldDecorator('notas')(
            <Input.TextArea Rows={8} maxRows={8} disabled={!this.state.edit} />
          )}
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