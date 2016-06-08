import React, { Component } from 'react';

import Minicurso from "./Minicurso.jsx";
import EditarMinicurso from "./EditarMinicurso.jsx";

export default class GerenciarMinicursos extends Component{
  render(){
    let { minicursos } = this.context;
    minicursos = minicursos.map(
      (cur)=>(
        <div key={cur._id}>
          <Minicurso minicurso={ cur }/>
          <EditarMinicurso minicurso={ cur }/>
        </div>
      )
    )

    return(
      <div>
        <h1>#GerenciarMinicursos</h1>
        <div>{ minicursos }</div>
      </div>
    )
  }
}

GerenciarMinicursos.contextTypes = {
  minicursos: React.PropTypes.array
}
