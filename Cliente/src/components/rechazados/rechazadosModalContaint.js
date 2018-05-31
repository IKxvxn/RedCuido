import React from 'react';
import { Form, Input, Cascader, Select, Button,Row, Col, message, DatePicker, Upload, Icon, TreeSelect } from 'antd';
import * as Mensajes from '../../assets/mensajes'
import moment from 'moment';
import * as Permisos from '../../assets/permisos' 
const domicilios =  require('../../assets/divisionCR.json').provincias
const FormItem = Form.Item;
const Option = Select.Option;


class editForm extends React.Component {
  //Define variables a utilizar
  state = {
      edit:true,
      loading:false,
      fileList: [],
      uploading: false,
      treeData: [{}],
      treeValue: []
  };

  //Verifica el formulario al crear un perfil
  handleSubmit = (handleCreate) => {
    this.props.form.validateFieldsAndScroll((err, caso) => {
      if (!err) {
        if(caso.cedula === undefined && (caso.nombre === undefined || caso.apellidos === undefined) 
           && caso.señas === undefined && caso.telefono === undefined){
            message.error(Mensajes.minNecesario)
           }
           else {
            //carga archivos del estado
            this.setState({
              uploading: true,
            });
            const { fileList } = this.state;
            const formData = new FormData();
            fileList.forEach((file) => {
              formData.append(file.name, file);
            });
            this.setState({
              uploading: false,
              fileList: []
            });
  
            //agrega caso al formdata y envia el caso y los files juntos
            formData.append('caso', JSON.stringify(caso))
            formData.append('usuario', JSON.stringify(this.props.usuario))
            handleCreate(formData, this.props.form.resetFields)
          }
      }
      else{message.error(Mensajes.verificar)}
    });
  }
  //revisa formulario al reactivar un perfil
  handleReactivateCaso = (reactivateCaso, nota) => {
    this.props.form.validateFieldsAndScroll((err, caso) => {
      if (!err) {
        if(caso.cedula === undefined && (caso.nombre === undefined || caso.apellidos === undefined) 
           && caso.señas === undefined && caso.telefono === undefined){
            message.error(Mensajes.minNecesario)
           }
        else{reactivateCaso(this.props.row, nota, this.props.usuario)}
      }
      else{message.error(Mensajes.verificar)}
    });
  }
  //revisa el formulario al eliminar un perfil
  handleDeleteCaso = (deleteCaso, nota) => {
    this.props.form.validateFieldsAndScroll((err, caso) => {
      if (!err) {
        if (caso.cedula === undefined && (caso.nombre === undefined || caso.apellidos === undefined)
          && caso.señas === undefined && caso.telefono === undefined) {
          message.error(Mensajes.minNecesario)
        }
        else { 
          deleteCaso(this.props.row, nota, this.props.usuario) 
          var nonwantedFiles = this.props.row.files;
          if (nonwantedFiles !== []){
            this.props.deleteFiles(nonwantedFiles) 
          }
        }
      }
      else { message.error(Mensajes.verificar) }
    });
  }

  //revisa formulario al editar un perfil
  enterLoading = () => {
    if (this.state.edit === false){
      this.setState({ edit: true});
    }
    else{
      this.props.form.validateFieldsAndScroll((err, caso) => {
        if (!err) {
          if (caso.cedula === undefined && (caso.nombre === undefined || caso.apellidos === undefined)
            && caso.señas === undefined && caso.telefono === undefined) {
            message.error(Mensajes.minNecesario)
          }
          else {
            this.setState({ edit: false });
            //carga archivos del estado
            this.setState({
              uploading: true,
            });
            const { fileList } = this.state;
            const formData = new FormData();
            fileList.forEach((file) => {
              formData.append(file.name, file);
            });
            this.setState({
              uploading: false,
              fileList: []
            });
            //Elimina los archivos que fueron deseleccionados
            var newFiles = []
            var nonwantedFiles = []
            for(var i=0; i<this.props.row.files.length; i++){
              if (this.state.treeValue.includes(i.toString())){
                newFiles.push(this.props.row.files[i])
              }
              else{
                nonwantedFiles.push(this.props.row.files[i])
              }
            }
            //agrega caso al formdata y envia el caso y los files juntos
            formData.append('caso', JSON.stringify({ ...caso, _id: this.props.row._id, files: newFiles }))
            formData.append('usuario', JSON.stringify(this.props.usuario))

            this.props.editCaso(formData)
            this.props.deleteFiles(nonwantedFiles)
            if (nonwantedFiles !== []){
              this.props.deleteFiles(nonwantedFiles) 
            }
          }
        }
        else { message.error(Mensajes.verificar) }
      });
      
      }
    }

    //Maneja los cambios en los archivos seleccionados para mantener en el caso y lo actualiza en el estado.
    onChange = (value) => {
      console.log(this.state.treeValue)
      console.log('onChange ', value, arguments);
      this.setState({ treeValue:value });
    }

    enterDownload = () => {
      this.props.downloadFile(this.props.row)
    }
  
    handleOptionsMode() {
      //props para el componente de Upload de archivos
      const props = {
        multiple: true,
        enctype: "multipart/form-data",
        action: '',
        onRemove: (file) => {
          this.setState(({ fileList }) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            return {
              fileList: newFileList,
            };
          });
        },
        beforeUpload: (file) => {
          this.setState(({ fileList }) => ({
            fileList: [...fileList, file],
          }));
          return false;
        },
        fileList: this.state.fileList,
      };
      //define la estructura del modal (botones)
      if (this.props.modo === "ver") {
        if (this.state.edit === false) {
          return (
            <Row gutter={8} type="flex" justify="end">
              <Col xs={24} sm={6}><Button icon="edit" onClick={this.enterLoading} disabled={Permisos.accessESPVISACEP(this.props.usuario.tipo)} loading={this.state.loading} type="primary">Editar</Button></Col>
              <Col xs={24} sm={9}>
                <Button icon="download" type="secondary" onClick={this.enterDownload}>Descargar Archivos</Button>
              </Col>
              <Col xs={24} sm={9}>
              <Upload {...props} >
                <Button disabled={true}> <Icon type="upload" />Añadir Archivo</Button>
              </Upload>
              </Col>
              </Row>
          )
        } else {
          return (
            <Row gutter={8} type="flex" justify="end">
              <Col xs={24} sm={6}><Button icon="edit" onClick={this.enterLoading} loading={this.state.loading} type="primary">Guardar</Button></Col>
              <Col xs={24} sm={9}>
                <Button icon="download" type="secondary"  onClick={this.enterDownload}>Descargar Archivos</Button>
              </Col>
              <Col xs={24} sm={9}>
              <Upload {...props} >
                <Button><Icon type="upload" />Añadir Archivo</Button>
              </Upload>
              </Col>
              </Row>
          )
        }
      }
      return (
        <Row gutter={8} type="flex" justify="end">
          <Col xs={24} sm={20}>
            <Upload {...props} >
              <Button> <Icon type="upload" />Añadir archivo</Button>
            </Upload>
          </Col>
        </Row>
      )
    }
  //monta los datos del formulario
  componentDidMount(){
    this.props.onRef(this)
    if(this.props.modo==="ver")
      {this.props.form.setFieldsValue({
          cedula:this.props.row.cedula,
          nombre:this.props.row.nombre,
          ingreso:moment(this.props.row.ingreso),
          rechazo:moment(this.props.row.rechazo),
          nacimiento:moment(this.props.row.nacimiento),
          apellidos:this.props.row.apellidos,
          telefono:this.props.row.telefono,
          domicilio:this.props.row.domicilio,
          señas:this.props.row.señas,
          sede:this.props.row.sede,
          notas:this.props.row.notas,
          files: this.state.treeValue
        })
        //Carga los archivos existentes y los marca en el tree
        var archivos = []
        var value = []
        for (var i=0; i < this.props.row.files.length; i++){
          value.push(i.toString())
          archivos.push({label:this.props.row.files[i].substring(17),value:i.toString(),key:i.toString(),children:[]})
        }
        this.setState({ edit: false, treeData: archivos, treeValue: value})
        this.props.form.setFieldsValue({files: value})
      }
    }
  //define la estructura del formulario
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
    const formItemLayout2 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
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
            <Input.TextArea rows={2} maxrows={2} disabled={!this.state.edit} />
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
          {...formItemLayout2}
          label="Fecha de Ingreso (Lista Espera)"
        >
        {getFieldDecorator('ingreso', {
        })(<DatePicker id={"ingreso"} disabled={!this.state.edit}/>
        )}
        </FormItem>
        <FormItem
          {...formItemLayout2}
          label="Fecha de Rechazo"
        >
        {getFieldDecorator('rechazo', {
        })(<DatePicker id={"rechazo"} disabled={!this.state.edit}/>
        )}
        </FormItem>  
        <FormItem
          {...formItemLayout2}
          label="Fecha de Nacimiento"
        >
          {getFieldDecorator('nacimiento', {
        })(<DatePicker id={"nacimiento"} disabled={!this.state.edit}/>
        )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Notas"
        >
          {getFieldDecorator('notas')(
            <Input.TextArea rows={8} maxrows={8} disabled={!this.state.edit} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Archivos"
        >
          {getFieldDecorator('files',{ initialValue: this.props.form.files })(
            <TreeSelect {...{treeData:this.state.treeData,
              onChange: this.onChange,
              treeCheckable: true,
              searchPlaceholder: 'Archivos incluidos',
              }} disabled = {!this.state.edit} />
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