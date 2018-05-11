import React from 'react';
import { Form, Input, Cascader, Select, Button,Row, Col, message, DatePicker, Upload, Icon, TreeSelect } from 'antd';
import * as Mensajes from '../../assets/mensajes'
import moment from 'moment';
const domicilios =  require('../../assets/divisionCR.json').provincias
const FormItem = Form.Item;
const Option = Select.Option;



class editForm extends React.Component {
  state = {
      edit:true,
      loading:false,
      fileList: [],
      uploading: false,
      treeData: [{}],
      treeValue: []
  };
  handleSubmit = (handleCreate) => {

    this.props.form.validateFieldsAndScroll((err, caso) => {
      if (!err) {
        if(caso.cedula === undefined && (caso.nombre === undefined || caso.apellidos === undefined) 
           && caso.señas === undefined && caso.telefono === undefined){
            message.error(Mensajes.minNecesario)
           }
        else{handleCreate(caso,this.props.form.resetFields,this.props.usuario)}
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

            this.props.editCaso(formData, this.props.visible)
            this.props.deleteFiles(nonwantedFiles)
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
  
    handleExcludeCaso = (excludeCaso, nota) => {
      this.props.form.validateFieldsAndScroll((err, caso) => {
        if (!err) {
          if(caso.cedula === undefined && (caso.nombre === undefined || caso.apellidos === undefined) 
             && caso.señas === undefined && caso.telefono === undefined && caso.alternativas === undefined){
              message.error(Mensajes.minNecesario)
             }
          else{excludeCaso(this.props.row, nota,this.props.usuario)}
        }
        else{message.error(Mensajes.verificar)}
      });
    }

    handleDeleteCaso = (deleteCaso, nota) => {
      this.props.form.validateFieldsAndScroll((err, caso) => {
        if (!err) {
          if (caso.cedula === undefined && (caso.nombre === undefined || caso.apellidos === undefined)
            && caso.señas === undefined && caso.telefono === undefined) {
            message.error(Mensajes.minNecesario)
          }
          else { deleteCaso(this.props.row, nota, this.props.usuario) }
        }
        else { message.error(Mensajes.verificar) }
      });
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
      if (this.props.modo === "ver") {
        if (this.state.edit === false) {
          return (
            <Row gutter={8} type="flex" justify="end">
              <Col xs={24} sm={6}><Button icon="edit" onClick={this.enterLoading} loading={this.state.loading} type="primary">Editar</Button></Col>
              <Col xs={12} sm={9}>
              <Upload {...props} >
                <Button disabled={true}> <Icon type="upload" />Añadir Archivo</Button>
              </Upload>
              </Col>
              <Col xs={12} sm={9}>
                <Button icon="download" type="secondary" onClick={this.enterDownload}>Descargar Archivos</Button>
              </Col>            
            </Row>
          )
        } else {
          return (
            <Row gutter={8} type="flex" justify="end">
              <Col xs={24} sm={6}><Button icon="edit" onClick={this.enterLoading} loading={this.state.loading} type="primary">Guardar</Button></Col>
              <Col xs={12} sm={9}>
              <Upload {...props} >
                <Button><Icon type="upload" />Añadir Archivo</Button>
              </Upload>
              </Col>
              <Col xs={12} sm={9}>
                <Button icon="download" type="secondary"  onClick={this.enterDownload}>Descargar Archivos</Button>
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
    
  
  componentDidMount(){
    this.props.onRef(this)
    if(this.props.modo==="ver")
      {this.props.form.setFieldsValue({
          cedula:this.props.row.cedula,
          nombre:this.props.row.nombre,
          apellidos:this.props.row.apellidos,
          sexo:this.props.row.sexo,
          ingreso:moment(this.props.row.ingreso),
          inicio:moment(this.props.row.inicio),
          nacimiento:moment(this.props.row.nacimiento),
          telefono:this.props.row.telefono,
          domicilio:this.props.row.domicilio,
          señas:this.props.row.señas,
          sede:this.props.row.sede,
          alternativas:this.props.row.alternativas,
          riesgo:this.props.row.riesgo,
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
          label="Sexo"
        >
          {getFieldDecorator('sexo',{initialValue:"Desconocido"})(
            <Select disabled={!this.state.edit}>
              <Option value="Femenino">Femenino</Option>
              <Option value="Masculino">Masculino</Option>
              <Option value="Desconocido">Desconocido</Option>
            </Select>
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
          label="Inicio"
        >
        {getFieldDecorator('inicio', {
        })(<DatePicker id={"inicio"} disabled={!this.state.edit}/>
        )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Nacimiento"
        >
          {getFieldDecorator('nacimiento', {
        })(<DatePicker id={"nacimiento"} disabled={!this.state.edit}/>
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
          label="Alternativas"
        >
          {getFieldDecorator('alternativas')(
            <Select mode="multiple" disabled={!this.state.edit}>
              <Option value="Artículos de uso personal">Artículos de uso personal</Option>
              <Option value="Ayuda técnica">Ayuda técnica</Option>
              <Option value="Alquiler de vivienda">Alquiler de vivienda</Option>
              <Option value="Asistente domiciliario">Asistente domiciliario</Option>
              <Option value="Equipamiento de casa">Equipamiento de casa</Option>
              <Option value="Institucionalización">Institucionalización</Option>
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
          label="Riesgo"
        >
          {getFieldDecorator('riesgo',{initialValue:"1"})(
            <Select disabled={!this.state.edit}>
              <Option value="4">4</Option>
              <Option value="3">3</Option>
              <Option value="2">2</Option>
              <Option value="1">1</Option>
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
        <FormItem
          {...formItemLayout}
          label="Archivos"
        >
          {getFieldDecorator('files',{ initialValue: this.props.form.files })(
            <TreeSelect {...{treeData:this.state.treeData,
              onChange: this.onChange,
              treeCheckable: true,
              searchPlaceholder: 'Archivos incluidos',
              style: {
                width: 300,
              },}} disabled = {!this.state.edit} />
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