import React from "react";
import { Input,Button,Icon, List,Radio, Popover, Row, Col } from 'antd';
import { Link } from 'react-router-dom'
const Search = Input.Search

class bontonDescarga extends React.Component {
  state = {
    size:"1"
  }

  handleSizeChange = (e) => {
    this.setState({ size: e.target.value });
  }

  render() {
    console.log(this.props.filtro)
      var content = (
        <List
          style={{maxHeight:"15rem",minWidth:"50vw", overflowX:"hidden",overflowY:"scroll"}}
          itemLayout="horizontal"
          dataSource={this.props.filtro}
          renderItem={(item,props=this.props) => (
            <List.Item style={{maxWidth:"15rem",minWidth:"15rem"}}>
              <List.Item.Meta
                avatar={
                  <Row gutter={8} type="flex" justify="center" style={{maxWidth:"3rem"}}>
                    <Col sm={24} >
                    <Link to={"/home/"+item.location} onClick={()=>{this.props.changeCaller("NOT");this.props.changeId(item._id)}}><Button shape="circle"  type="secondary"><Icon type="eye" /></Button></Link>
                    </Col>
                  </Row>
                }
                title={<span style={{color:"#00a148"}}>{"Caso encontrado en "+item.location}</span>}
                
                description={
                  <Row style={{width:"45vw"}}>
                    {item.nombre!==undefined?<Col sm={8}><span style={{fontWeight:700}}>Nombre: </span><span>{item.nombre}</span></Col>:false}
                    {item.apellidos!==undefined?<Col sm={8}><span style={{fontWeight:700}}>Apellidos: </span><span>{item.apellidos}</span></Col>:false}
                    {item.cedula!==undefined?<Col sm={8}><span style={{fontWeight:700}}>Cédula: </span><span>{item.cedula}</span></Col>:false}
                    {item.sede!==undefined?<Col sm={8}><span style={{fontWeight:700}}>Sede: </span><span>{item.sede}</span></Col>:false}
                    {item.telefono!==undefined?<Col sm={8}><span style={{fontWeight:700}}>Teléfono: </span><span>{item.telefono}</span></Col>:false}

                  </Row>
                }
              />
            </List.Item>
          )}
        />
      );
    
    return(
      <Row type="flex" justify="start">
        {(this.state.size==="0")?<Col sm={20}><Search placeholder="Buscar sólo en esta lista" onSearch={value => {this.props.filtrarCampos(value);this.props.changeId("")}}/></Col>:
        <Popover placement="bottomLeft" title={this.props.filtro.length===1?this.props.filtro.length+" Encontrado":this.props.filtro.length+" Encontrados"} content={content} trigger="focus">
          <Col sm={20}>
              <Search onSearch={value=>this.props.getFiltered(this.props.usuario,value)} defaultValue={this.props.query} placeholder="Buscar en todas las listas"/>
          </Col>    
        </Popover>}
        <Col sm={4}>
          <Radio.Group style={{padding:"0 0 0 1vw"}} value={this.state.size} onChange={this.handleSizeChange}>
            <Radio.Button value="0">Esta</Radio.Button>
            <Radio.Button value="1">Todas</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>)
    }
    
}


export default bontonDescarga