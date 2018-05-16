import React from "react";
import { Button, Row, Col, Radio, Popover } from 'antd';
const Json2csvParser = require('json2csv').Parser;
var FileSaver = require('browser-filesaver');
var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
var dateFormat = require('dateformat');
const domicilios = require('../../assets/divisionCR.json').provincias

const text = <span>Opciones de Descarga</span>;


class bontonDescarga extends React.Component {
  state = {
      edit:false,
      loading:false,
      tipo:'1',
      info:'1'
  };

  //Preconfigura el domicilio y fecha en los casos.
  preconfigurarJson = (json) => {
    for (var i=0; i<json.length; i++){
      var domicilio = json[i].domicilio;
      var lista = domicilios;
      var nuevoDomicilio = "";
      for (var j=0; j < domicilio.length; j++){
        if (j !==0 ){
          lista = lista[domicilio[j-1]].children;
          nuevoDomicilio = nuevoDomicilio + ", "
        }
        nuevoDomicilio = nuevoDomicilio + lista[domicilio[j]].label
      }
      json[i].domicilio = nuevoDomicilio;
      json[i].ingreso = dateFormat(json[i].ingreso,'dd-mm-yyyy');
      json[i].nacimiento = dateFormat(json[i].nacimiento,'dd-mm-yyyy');
      json[i].inicio = dateFormat(json[i].inicio,'dd-mm-yyyy');
      json[i].rechazo = dateFormat(json[i].rechazo,'dd-mm-yyyy');
      json[i].exclusion = dateFormat(json[i].exclusion,'dd-mm-yyyy');
    }
    return json;
  }

  //Si el formato es 1, se crea archivo con solo seleccionados. Si es 2, con todos los casos.
  download = (formato) => {
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
      var excelStrings = true;
      var delimiter = ";";
      const json2csvParser = new Json2csvParser({ fields,excelStrings,delimiter});
      //Si se utilizan solo las filas seleccionadas
      if (formato === "1"){
        datosCsv = json2csvParser.parse(this.preconfigurarJson(this.props.seleccionadas));
      }
      //Si se utilizan todas las filas
      else{
        datosCsv = json2csvParser.parse(this.preconfigurarJson(this.props.todos));
      }
      var blob = new Blob([datosCsv], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, `casos_${this.props.lista}.csv`);
    }else{ //PDF
      var bodyt = [fields]
      var obj;
      if (formato === "1"){
        obj = this.preconfigurarJson(this.props.seleccionadas);
      }//Si se utilizan todas las filas
      else{
        obj = this.preconfigurarJson(this.props.todos);
      }
      for (var elem in obj) {
        var arr = [];
        for(var att in fields){
          if(obj[elem][fields[att]]==null){
            arr.push("-");
          }else{
            arr.push(obj[elem][fields[att]]);
          }
        }
        bodyt.push(arr);
      }
      var widthsl=Array.apply(null, Array(fields.length)).map(Number.prototype.valueOf,930/fields.length);
      console.log(widthsl)
      var dd = { content: [{text: 'Red de Cuido Sede Heredia', style: 'header'},
          'Teléfono: (506) 2275-3989', 'Correo electrónico: reddecuido.ccheredia@gmail.com', `PDF generado el: ${dateFormat(new Date(),"dd-mm-yyyy")}`,
          {text: `Lista de ${this.props.lista}`, style: 'subheader'},
          {style: 'tableExample',
            table: {headerRows: 1,widths:widthsl,body: bodyt},layout: 'lightHorizontalLines',fontSize: 10.5}
        ],pageOrientation: 'landscape', pageSize: 'A3',styles: { header: {fontSize: 18,bold: true,margin: [0, 0, 0, 10]},
          subheader: {fontSize: 16,bold: true,margin: [0, 10, 0, 5]},
          tableExample: {margin: [0, 5, 0, 15]},
          tableHeader: {bold: true,fontSize: 13,color: 'black'}},
        defaultStyle: {// alignment: 'justify'
        }
      }
      pdfMake.createPdf(dd).download(`casos_${this.props.lista}.pdf`);
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