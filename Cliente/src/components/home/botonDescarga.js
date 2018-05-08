import React from "react";
import { Button, Row, Col, Radio, Popover } from 'antd';
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
            <Button style={{width:"18rem"}} type="secondary">Sólo Seleccionados ({this.props.seleccionadas.length})</Button>
          </Col>
          <Col>
            <Button style={{width:"18rem",marginTop:"0.25rem"}} type="secondary">Todos los Casos ({this.props.todos.length})</Button>
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