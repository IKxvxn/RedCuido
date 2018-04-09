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
  handleSubmit = (handleCreate) => {

    this.props.form.validateFieldsAndScroll((err, caso) => {
      if (!err) {
        if(caso.cedula === undefined && (caso.nombre === undefined || caso.apellidos === undefined) 
           && caso.señas === undefined && caso.telefono === undefined){
            message.error(Mensajes.minNecesario)
           }
        else{handleCreate(caso,this.props.form.resetFields)}
      }
      else{message.error(Mensajes.verificar)}
    });
  }
  handleAccept = (acceptCaso) => {
    this.props.form.validateFieldsAndScroll((err, caso) => {
      if (!err) {
        if(caso.cedula === undefined && (caso.nombre === undefined || caso.apellidos === undefined) 
           && caso.señas === undefined && caso.telefono === undefined){
            message.error(Mensajes.minNecesario)
           }
        else{acceptCaso(this.props.row)}
      }
      else{message.error(Mensajes.verificar)}
    });
  }
  
  enterLoading = () => {
    if (this.state.edit === false){
      this.setState({ edit: true});
      message.error(Mensajes.alreadyEditing);
    }
    else{
      this.props.form.validateFieldsAndScroll((err, caso) =>{
        if (!err) {
          if(caso.cedula === undefined && (caso.nombre === undefined || caso.apellidos === undefined) 
             && caso.señas === undefined && caso.telefono === undefined){
              message.error(Mensajes.minNecesario)
             }
          else{
            this.setState({ edit: false});
            this.props.editCaso({...caso,_id:this.props.row._id,rechazo:this.props.row.rechazo},this.props.form.resetFields)
          }
        }
        else{message.error(Mensajes.verificar)}
      });
      
      }
    }
  
  handleOptionsMode(){
    if(this.props.modo==="ver"){
      return(
        <Row gutter={8}>
            <Col xs={24} sm={24}><Button icon="edit"  onClick={this.enterLoading} loading={this.state.loading} type="primary">Editar</Button></Col>
        </Row>
      )
    }
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
          señas:this.props.row.señas,
          sede:this.props.row.sede,
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