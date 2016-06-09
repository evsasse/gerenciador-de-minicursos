import React, { Component } from 'react';

import Minicurso from "./Minicurso.jsx";
import EditarMinicurso from "./EditarMinicurso.jsx";

export default class GerenciarMinicursos extends Component{
  constructor(props){
    super(props)
    this.state = {
      editarAtual: ''
    }
  }

  mostrarEditarMinicurso(id){
    id = (id === this.state.editarAtual)? '': id;
    this.setState({
      editarAtual: id
    })
  }

  render(){
    let { minicursos } = this.context;
    minicursos = minicursos.map(
      (cur)=>{
        let esconder = (this.state.editarAtual === cur._id)?'':'editar-esconder';
        return (
          <div key={cur._id}>
            <Minicurso minicurso={ cur }>
              <button onClick={this.mostrarEditarMinicurso.bind(this,cur._id)}>Editar</button>
            </Minicurso>
            <EditarMinicurso minicurso={ cur } className={esconder}/>
          </div>
        )
      }
    )

    return(
      <div>
        <h1>#GerenciarMinicursos</h1>
        <div>{ minicursos }</div>
        <EditarMinicurso>
          <h2>Novo Minicurso</h2>
        </EditarMinicurso>
      </div>
    )
  }
}

GerenciarMinicursos.contextTypes = {
  minicursos: React.PropTypes.array
}
