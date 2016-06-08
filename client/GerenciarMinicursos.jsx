import React, { Component } from 'react';

import Minicurso from "./Minicurso.jsx";

export default class GerenciarMinicursos extends Component{
  render(){
    let { minicursos } = this.context;
    minicursos = minicursos.map(
      (cur)=>(<Minicurso key={cur._id} minicurso={ cur }/>)
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
