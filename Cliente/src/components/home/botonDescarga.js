import React from "react";
import { Button, Row, Col, Radio, Popover } from 'antd';
const Json2csvParser = require('json2csv').Parser;
var FileSaver = require('browser-filesaver');
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const text = <span>Opciones de Descarga</span>;


class bontonDescarga extends React.Component {
  state = {
      edit:false,
      loading:false,
      tipo:'1',
      info:'1'
  };

  //Si el formato es 1, se crea archivo con solo seleccionados. Si es 2, con todos los casos.
  download = (formato) => {
    console.log("entra")
   var fields = []
    switch(this.props.lista) {
      case "espera":
          if (this.state.info === "1"){
            fields = ["cedula","apellidos","nombre","domicilio","señas","telefono","ingreso","problemas","sede","prioridad"]
          }
          else{
            fields = ["cedula","apellidos","nombre","ingreso","prioridad","señas","telefono","sede"]
          }break;
      case "visitados":
          if (this.state.info === "1"){
            fields = ["cedula","apellidos","nombre","domicilio","señas","telefono","ingreso","nacimiento","problemas","sede","prioridad","alternativas","riesgo"]
          }
          else{
            fields = ["cedula","apellidos","nombre","ingreso","prioridad","señas","telefono","sede"]
          }break;
      case "activos":
          if (this.state.info === "1"){
            fields = ["cedula","apellidos","nombre","sexo","nacimiento","ingreso","inicio","domicilio","señas","telefono","alternativas","sede","riesgo"]
          }
          else{
            fields = ["cedula","apellidos","nombre","inicio","telefono","sede","riesgo"]
          }break;
      case "excluidos":
          if (this.state.info === "1"){
            fields = ["cedula","apellidos","nombre","domicilio","señas","telefono","ingreso","nacimiento","inicio","exclusion","altv_aprobadas","sede"]
          }
          else{
            fields = ["cedula","apellidos","nombre","exclusion","inicio","señas","telefono","sede"]
          }break;
      case "rechazados":
          if (this.state.info === "1"){
            fields = ["cedula","apellidos","nombre","domicilio","señas","telefono","ingreso","rechazo","sede"]
          }
          else{
            fields = ["cedula","apellidos","nombre","rechazo","señas","telefono","sede"]
          }break;
      default:
          fields = []
  }
    //Si se debe crear csv (EXCEL)
    if (this.state.tipo === "2"){
      var datosCsv;
      const json2csvParser = new Json2csvParser({ fields });
      //Si se utilizan solo las filas seleccionadas
      if (formato === "1"){
        datosCsv = json2csvParser.parse(this.props.seleccionadas);
      }
      //Si se utilizan todas las filas
      else{
        datosCsv = json2csvParser.parse(this.props.todos)
      }
      var blob = new Blob([datosCsv], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, `casos_${this.props.lista}.csv`);
    }

  }

  onChangeType = (e) => {
    this.setState({tipo:e.target.value})
  }

  onChangeInfo = (e) => {
    this.setState({info:e.target.value})
  }

  render() {
      var content = (
        <Row>
          <Col>
            <p>Formato de Archivo:</p>
          </Col>
          <Col>
            <RadioGroup style={{display:"inlineblock"}} onChange={this.onChangeType} defaultValue="1">
                <RadioButton style={{width:"9rem"}} value="1">PDF</RadioButton>
                <RadioButton style={{width:"9rem"}} value="2">EXCEL</RadioButton>
            </RadioGroup>
          </Col>
          <Col>
            <p style={{marginTop:"0.5rem"}}>Tipo de Información:</p>
          </Col>
          <Col>
            <RadioGroup onChange={this.onChangeInfo} defaultValue="1">
                <RadioButton style={{width:"9rem"}} value="1">Detallada</RadioButton>
                <RadioButton style={{width:"9rem"}} value="2">General</RadioButton>
            </RadioGroup>
          </Col>
          <Col>
            <p style={{marginTop:"0.5rem"}}>Tipo de Descarga:</p>
          </Col>
          <Col>
          </Col>
          <Col>
            <Button style={{width:"18rem"}} type="secondary" onClick={() => this.download("1")} >Sólo Seleccionados ({this.props.seleccionadas.length})</Button>
          </Col>
          <Col>
            <Button style={{width:"18rem",marginTop:"0.25rem"}} type="secondary" onClick={() => this.download("2")}>Todos los Casos ({this.props.todos.length})</Button>
          </Col>
        </Row>
      );
    
    return( 
      <Popover placement="bottom" title={text} content={content} trigger="click">
        <Button icon="download" type="primary">Descargar</Button>
      </Popover>)
    }
}


export default bontonDescarga