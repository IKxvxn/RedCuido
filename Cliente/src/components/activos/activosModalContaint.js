import React from 'react';
import { Form, Input, Cascader, Select, Button,Row, Checkbox, Col, message, DatePicker, Divider, Upload, Icon, TreeSelect } from 'antd';
import * as Mensajes from '../../assets/mensajes'
import moment from 'moment';
import * as Permisos from '../../assets/permisos' 

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
      treeValue: [],
      check_alternativas: [false,false,false,false,false,false,false,false,false,false]
  };
  handleSubmit = (handleCreate) => {

    this.props.form.validateFieldsAndScroll((err, caso) => {
      if (!err) {
        if(caso.cedula === undefined && (caso.nombre === undefined || caso.apellidos === undefined) 
           && caso.señas === undefined && caso.telefono === undefined){
            message.error(Mensajes.minNecesario)
           }
           else {
            //revisa alternativas no aprobadas/aprobadas
            var alternativas = ['alt_alimentacion', 'alt_higiene', 'alt_salud', 'alt_atencion', 'alt_apoyo', 'alt_equipamento', 'alt_alquiler', 'alt_familias', 'alt_asistente', 'alt_institucionalizacion']
            for (var i = 0; i < this.state.check_alternativas.length; i++){
              if(this.state.check_alternativas[i] === false){
                caso[alternativas[i]] = "[No aprobada]"
              }
              else{
                caso[alternativas[i]] = caso[alternativas[i]] === undefined ? "[Aprobada]" : caso[alternativas[i]]
              }
            }
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
            //revisa alternativas no aprobadas/aprobadas
            var alternativas = ['alt_alimentacion', 'alt_higiene', 'alt_salud', 'alt_atencion', 'alt_apoyo', 'alt_equipamento', 'alt_alquiler', 'alt_familias', 'alt_asistente', 'alt_institucionalizacion']
            for (var l = 0; l < this.state.check_alternativas.length; l++){
              if(this.state.check_alternativas[l] === false){
                caso[alternativas[l]] = "[No aprobada]"
              }
              else{
                caso[alternativas[l]] = caso[alternativas[l]] === undefined ? "[Aprobada]" : caso[alternativas[l]]
              }
            }
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
            if (nonwantedFiles !== []){
              this.props.deleteFiles(nonwantedFiles) 
            }
          }
        }
        else { message.error(Mensajes.verificar) }
      });
      
      }
    }

    //Maneja el chequeo de alternativas en el form.
    handleChange = (index) => {
      var check_alternativas_aux = this.state.check_alternativas;
      check_alternativas_aux[index] = !check_alternativas_aux[index];
      this.setState({
        check_alternativas: check_alternativas_aux,
      })
      if(index===0){this.props.form.setFieldsValue({alt_alimentacion:"[No]"})}
      else if(index===0){this.props.form.setFieldsValue({alt_alimentacion:""})}
      else if(index===1){this.props.form.setFieldsValue({alt_higiene:""})}
      else if(index===2){this.props.form.setFieldsValue({alt_salud:""})}
      else if(index===3){this.props.form.setFieldsValue({alt_atencion:""})}
      else if(index===4){this.props.form.setFieldsValue({alt_apoyo:""})}
      else if(index===5){this.props.form.setFieldsValue({alt_equipamento:""})}
      else if(index===6){this.props.form.setFieldsValue({alt_alquiler:""})}
      else if(index===7){this.props.form.setFieldsValue({alt_familias:""})}
      else if(index===8){this.props.form.setFieldsValue({alt_asistente:""})}
      else if(index===9){this.props.form.setFieldsValue({alt_institucionalizacion:""})}
    }

    //Maneja los cambios en los archivos seleccionados para mantener en el caso y lo actualiza en el estado.
    onChange = (value) => {
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
      if (this.props.modo === "ver") {
        if (this.state.edit === false) {
          return (
            <Row gutter={8} type="flex" justify="end">
              <Col xs={24} sm={6}><Button icon="edit" disabled={Permisos.accessGENLIST(this.props.usuario.tipo)} onClick={this.enterLoading} loading={this.state.loading} type="primary">Editar</Button></Col>
              <Col xs={24} sm={9}>
                <Button icon="download" type="secondary" onClick={this.enterDownload}>Descargar Archivos</Button>
              </Col>    
              <Col xs={24} sm={9}>
              <Upload  {...props} >
                <Button  disabled={true}> <Icon type="upload" />Añadir Archivo</Button>
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
    
  
  componentDidMount(){
    this.props.onRef(this)
    if(this.props.modo==="ver")
      {this.props.form.setFieldsValue({
          cedula:this.props.row.cedula,
          nombre:this.props.row.nombre,
          apellidos:this.props.row.apellidos,
          ingreso:moment(this.props.row.ingreso),
          inicio:moment(this.props.row.inicio),
          nacimiento:moment(this.props.row.nacimiento),
          telefono:this.props.row.telefono,
          domicilio:this.props.row.domicilio,
          señas:this.props.row.señas,
          sede:this.props.row.sede,
          alt_alimentacion: this.props.row.alt_alimentacion,
          alt_higiene: this.props.row.alt_higiene, //Articulos de uso personal e higiene
          alt_salud: this.props.row.alt_salud, //Medicamentos e implementos de salud
          alt_atencion: this.props.row.alt_atencion, //Atecion social en salud integral
          alt_apoyo: this.props.row.alt_apoyo, //Productos de spoyo o ayudas tecnicas
          alt_equipamento: this.props.row.alt_equipamento, //Equipamento de casa
          alt_alquiler: this.props.row.alt_alquiler, //Alquiler de vivienda, servicios basicos y municipales
          alt_familias: this.props.row.alt_familias, //Familias solidarias
          alt_asistente: this.props.row.alt_asistente, //Asistente domiciliario
          alt_institucionalizacion: this.props.row.alt_institucionalizacion,
          riesgo:this.props.row.riesgo,
          notas:this.props.row.notas,
          files: this.state.treeValue
        })
        //Carga los archivos existentes y los marca en el tree
        var archivos = []
        var value = []
        for (var h=0; h < this.props.row.files.length; h++){
          value.push(h.toString())
          archivos.push({label:this.props.row.files[h].substring(17),value:h.toString(),key:h.toString(),children:[]})
        }
        this.setState({ edit: false, treeData: archivos, treeValue: value})
        this.props.form.setFieldsValue({files: value})
        //Revisa las alternativas aprobadas
        var alternativas = ['alt_alimentacion', 'alt_higiene', 'alt_salud', 'alt_atencion', 'alt_apoyo', 'alt_equipamento', 'alt_alquiler', 'alt_familias', 'alt_asistente', 'alt_institucionalizacion']
        for (var k = 0; k < this.state.check_alternativas.length; k++){
          var check_alternativas_aux = this.state.check_alternativas;
          if(this.props.row[alternativas[k]] === "[No aprobada]"){
            check_alternativas_aux[k] = false;
            this.setState({check_alternativas: check_alternativas_aux})
          }
          else{
            check_alternativas_aux[k] = true;
            this.setState({check_alternativas: check_alternativas_aux})          }
        }
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
    const formItemLayout3 = null;

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
          {...formItemLayout}
          label="Riesgo"
        >
          {getFieldDecorator('riesgo',{initialValue:"1"})(
            <Select disabled={!this.state.edit}>
              <Option value="5">5</Option>
              <Option value="4">4</Option>
              <Option value="3">3</Option>
              <Option value="2">2</Option>
              <Option value="1">1</Option>
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
          label="Fecha de Inicio en Activos"
        >
        {getFieldDecorator('inicio', {
        })(<DatePicker id={"inicio"} disabled={!this.state.edit}/>
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
        
        <Divider>Alternativas Aprobadas</Divider>
        <FormItem {...formItemLayout3}
          label="Alimentación">
          <Checkbox
            value={this.state.checkNick}
            onChange={()=>this.handleChange(0)}
            disabled={!this.state.edit}
            checked={this.state.check_alternativas[0]}
          >
            Marcar para incluir alternativa. Agregue detalle a continuación:
          </Checkbox>
        </FormItem>
        <FormItem
          {...formItemLayout3}

        >
          {getFieldDecorator('alt_alimentacion')(
            <Input.TextArea rows={2} maxrows={2} disabled={!this.state.edit} />
          )}
        </FormItem>
        <FormItem {...formItemLayout3}
          label="Artículos de Uso Personal e Higiene">
          <Checkbox
            value={this.state.checkNick}
            onChange={()=>this.handleChange(1)}
            disabled={!this.state.edit}
            checked={this.state.check_alternativas[1]}
          >
            Marcar para incluir alternativa. Agregue detalle a continuación:
          </Checkbox>
        </FormItem>
        <FormItem
          {...formItemLayout3}
        >
          {getFieldDecorator('alt_higiene')(
            <Input.TextArea rows={2} maxrows={2} disabled={!this.state.edit} />
          )}
        </FormItem>
        <FormItem {...formItemLayout3}
          label="Medicamentos e Implementos de Salud">
          <Checkbox
            value={this.state.checkNick}
            onChange={()=>this.handleChange(2)}
            checked={this.state.check_alternativas[2]}
            disabled={!this.state.edit}
          >
            Marcar para incluir alternativa. Agregue detalle a continuación:
          </Checkbox>
        </FormItem>
        <FormItem
          {...formItemLayout3}
        >
          {getFieldDecorator('alt_salud')(
            <Input.TextArea rows={2} maxrows={2} disabled={!this.state.edit} />
          )}
        </FormItem>
        <FormItem {...formItemLayout3}
          label="Atención Social en Salud Integral">
          <Checkbox
            value={this.state.checkNick}
            onChange={()=>this.handleChange(3)}
            disabled={!this.state.edit}
            checked={this.state.check_alternativas[3]}
          >
            Marcar para incluir alternativa. Agregue detalle a continuación:
          </Checkbox>
        </FormItem>
        <FormItem
          {...formItemLayout3}
        >
          {getFieldDecorator('alt_atencion')(
            <Input.TextArea rows={2} maxrows={2} disabled={!this.state.edit} />
          )}
        </FormItem>
        <FormItem {...formItemLayout3}
          label="Productos de Apoyo o Ayudas Técnicas">
          <Checkbox
            value={this.state.checkNick}
            onChange={()=>this.handleChange(4)}
            disabled={!this.state.edit}
            checked={this.state.check_alternativas[4]}
          >
            Marcar para incluir alternativa. Agregue detalle a continuación:
          </Checkbox>
        </FormItem>
        <FormItem
          {...formItemLayout3}
        >
          {getFieldDecorator('alt_apoyo')(
            <Input.TextArea rows={2} maxrows={2} disabled={!this.state.edit} />
          )}
        </FormItem>
        <FormItem {...formItemLayout3}
          label="Equipamento de Casa">
          <Checkbox
            value={this.state.checkNick}
            onChange={()=>this.handleChange(5)}
            disabled={!this.state.edit}
            checked={this.state.check_alternativas[5]}
          >
            Marcar para incluir alternativa. Agregue detalle a continuación:
          </Checkbox>
        </FormItem>
        <FormItem
          {...formItemLayout3}
        >
          {getFieldDecorator('alt_equipamento')(
            <Input.TextArea rows={2} maxrows={2} disabled={!this.state.edit} />
          )}
        </FormItem>
        <FormItem {...formItemLayout3}
          label="Alquiler de Vivienda, Servicios Básicos y Municipales">
          <Checkbox
            value={this.state.checkNick}
            onChange={()=>this.handleChange(6)}
            disabled={!this.state.edit}
            checked={this.state.check_alternativas[6]}
          >
            Marcar para incluir alternativa. Agregue detalle a continuación:
          </Checkbox>
        </FormItem>
        <FormItem
          {...formItemLayout3}
        >
          {getFieldDecorator('alt_alquiler')(
            <Input.TextArea rows={2} maxrows={2} disabled={!this.state.edit} />
          )}
        </FormItem>
        <FormItem {...formItemLayout3}
          label="Familias Solidarias">
          <Checkbox
            value={this.state.checkNick}
            onChange={()=>this.handleChange(7)}
            disabled={!this.state.edit}
            checked={this.state.check_alternativas[7]}
          >
            Marcar para incluir alternativa. Agregue detalle a continuación:
          </Checkbox>
        </FormItem>
        <FormItem
          {...formItemLayout3}
        >
          {getFieldDecorator('alt_familias')(
            <Input.TextArea rows={2} maxrows={2} disabled={!this.state.edit} />
          )}
        </FormItem>
        <FormItem {...formItemLayout3}
          label="Asistente Domiciliario">
          <Checkbox
            value={this.state.checkNick}
            onChange={()=>this.handleChange(8)}
            disabled={!this.state.edit}
            checked={this.state.check_alternativas[8]}
          >
            Marcar para incluir alternativa. Agregue detalle a continuación:
          </Checkbox>
        </FormItem>
        <FormItem
          {...formItemLayout3}
        >
          {getFieldDecorator('alt_asistente')(
            <Input.TextArea rows={2} maxrows={2} disabled={!this.state.edit} />
          )}
        </FormItem>
        <FormItem {...formItemLayout3}
          label="Institucionalización">
          <Checkbox
            value={this.state.checkNick}
            onChange={()=>this.handleChange(9)}
            disabled={!this.state.edit}
            checked={this.state.check_alternativas[9]}
          >
            Marcar para incluir alternativa. Agregue detalle a continuación:
          </Checkbox>
        </FormItem>
        <FormItem
          {...formItemLayout3}
        >
          {getFieldDecorator('alt_institucionalizacion')(
            <Input.TextArea rows={2} maxrows={2} disabled={!this.state.edit} />
          )}
        </FormItem>
        <Divider />
        <FormItem
          {...formItemLayout3}
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