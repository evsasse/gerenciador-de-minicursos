import React, { Component } from 'react';
import classNames from 'classnames';

export default class Minicurso extends Component{
  render(){
    const { minicurso } = this.props;
    const inativo = (minicurso.ativo)? '':'inativo';
    return(
      <div className={classNames("minicurso",inativo)}>
        { this.props.children }
        <h2>{ minicurso.nome }</h2>
        <em>{ inativo }</em>
        <p>{ minicurso.descricao }</p>
      </div>
    )
  }
}
