import React, {Component} from 'react';
import classNames from 'classnames';

export default class EditarMinicurso extends Component{
  render(){
    const minicurso = (this.props.minicurso)?
      this.props.minicurso : { _id: '', nome: '', descricao: '', ativo: false};

    const inativo = (minicurso.ativo)? '':'inativo';
    const editarCriar = (minicurso._id)? 'Editar':'Criar';
    return(
      <form className={classNames("minicurso", "editar-minicurso", this.props.className)}>
        { this.props.children }
        <div className="editar-minicurso-main">
          <span>
            <input type="text" defaultValue={minicurso.nome} placeholder="Nome"/>
            <label><input type="checkbox" defaultChecked={minicurso.ativo}/>Ativo</label>
          </span>
          <input type="submit" value={editarCriar}/>
        </div>
        <div>
          <textarea defaultValue={ minicurso.descricao } placeholder="Descrição, pode conter Markdown"/>
        </div>
      </form>
    )
  }
}
