import React from 'react';
import {Row} from 'antd';
import Modal from './esperaModalContainer'

export const columns = [{
    title: 'Cedula',
    dataIndex: 'cedula',
    key: 'cedula',
  },{
    title: 'Apellidos',
    dataIndex: 'apellidos',
    key: 'apellidos',
    sorter: (a, b) => a.apellidos.localeCompare(b.apellidos),
  }, {
    title: 'Nombre',
    dataIndex: 'nombre',
    key: 'nombre',
  },{
    title: 'Dirección',
    dataIndex: 'direccion',
    key: 'direccion',
  },{
    title: 'Teléfono',
    dataIndex: 'telefono',
    key: 'telefono',
  }, {
    title: 'Postulado',
    dataIndex: 'postulado',
    key: 'postulado',
    sorter: (a, b) => new Date(b.postulado) - new Date(a.postulado),
  
  }, {
    title: 'Prioridad',
    dataIndex: 'prioridad',
    key: 'prioridad',
    render: text => <div className={text+" prioridadFormat"}>{text}</div>,
    filters: [{text: 'Prioridad Alta', value: 'Alta'}, {text: 'Prioridad Media',value: 'Media'},{text: 'Prioridad Baja',value: 'Baja'}],
    onFilter: (value, record) => record.prioridad.indexOf(value) === 0,
    width: "6.5rem",
  },{
    title: 'Acciones',
    key: 'acciones',
    render: (text, row) => <Modal row={row} />,
    fixed: 'right',
    width: "5rem",
  }];

export const data = [{
    key: '1',
    cedula:'604310202',
    apellidos: 'Arias Chinchilla',
    nombre:'Kevin',
    direccion: 'Contiguo a la Escuela, Santo Tomás, Heredia, Santo Domingo, 40302',
    telefono: '85174176',
    postulado: '2018-03-07',
    prioridad: 'Alta',
  }, {
    key: '2',
    cedula:'116820021',
    apellidos: 'Bolaños Murillo',
    nombre:'Valeria',
    domicilio:[1, 18, 0],
    direccion:'1 KM este de Bomba la Galera carretera a Tres Ríos, San José, Curridabat, 11803',
    telefono: '89425128',
    postulado: '2016-01-03',
    problemas:["Otros"],
    prioridad: 'Baja',
    notas:"Aiudenla\n\nProbando saldo de línea.\n\n:D",
  }, {
    key: '3',
    cedula:'116590367',
    apellidos: 'Flores Muñoz',
    nombre:'Gloriana',
    direccion: 'Frente a Intersección de la Antigua Fabrica Gallito, Circunvalación, San José, Guadalupe',
    telefono: '84679453',
    postulado: '2017-12-01',
    prioridad: 'Media',
  }];
  