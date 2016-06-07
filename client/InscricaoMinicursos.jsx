import React, { Component } from "react";

export default class InscricaoMinicursos extends Component {
  getMinicursos(){
    //return [];
    return [
      {_id:"1",nome:"Yo",descricao:"Banana",ativo:true},
      {_id:"2",nome:"Yeaa",descricao:"Laranja",ativo:true},
      {_id:"3",nome:"Hey",descricao:"Maçã",ativo:true},
      {_id:"4",nome:"Oy",descricao:"Kiwi",ativo:false}
    ]
  }

  render(){
    let minicursos = this.getMinicursos();
    minicursos = minicursos.map((cur)=>{
      let inativo = (cur.ativo)? '':'inativo';
      return (
        <label key={ cur._id } className={inativo}>
          <input type="checkbox" />
          <h2>{ cur.nome }</h2>
          <em>{ inativo }</em>
          <div>{ cur.descricao }</div>
        </label>
      )
    })

    let formulario = (minicursos.length > 0)? (
      <form>
        <h1>Inscrição para minicursos</h1>
        <div className="inscricao-minicursos">{ minicursos }</div>
        <div className="inscricao-pessoa">
          <input type="text" placeholder="Nome *" required/>
          <input type="email" placeholder="Email *" required/>
          <input type="text" placeholder="CPF"/>
          <input type="submit" value="Inscrever-se"/>
        </div>
      </form>
    ):(
      <div className="inscricao-indisponivel">
        <h1>Não há minicursos disponíveis no momento</h1>
        <em>Costumamos publicar nas páginas de Ciências da Computação, e Sistemas de Infomação no Facebook, nas listas de email dos cursos, e no site do PET, quando disponibilizamos novos cursos e vagas. Fique atento! (:</em>
      </div>
    )

    return (
      <div className="inscricao">
        { formulario }
      </div>
    )
  }
}
