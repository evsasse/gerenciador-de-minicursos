import React, {Component} from 'react';

export default class EditarMinicurso extends Component{
  render(){
    const { minicurso } = this.props;
    const inativo = (minicurso.ativo)? '':'inativo';
    return(
      <form className="minicurso editar-minicurso">
        <div className="editar-minicurso-main">
          <span>
            <input type="text" defaultValue={minicurso.nome}/>
            <label><input type="checkbox" defaultChecked={minicurso.ativo}/>Ativo</label>
          </span>
          <input type="submit" value="Editar"/>
        </div>
        <div>
          <textarea defaultValue={ minicurso.descricao }/>
        </div>
      </form>
    )
  }
}
