import React, {Component} from "react";

export default class App extends Component{
  render(){
    const main = this.props.children;
    const gerenciar = (true)?(
      <a href="/gerenciar"> cursos</a>
    ): '';
    const admin = (true)? (
      <a href="/admins"> admins</a>
    ): '';
    const login = (false)? (
      <a href="/"> logout</a>
    ):(
      <a href="/login">login</a>
    )

    return(
      <div>
        <header>
          <h1><a href="/">Minicursos</a></h1>
        </header>
        <div className="container">
          { main }
        </div>
        <footer>
          <a href="http://petcomputacao.paginas.ufsc.br/" target="page"> pet</a>
          <a href="https://github.com/evsasse/gerenciador-de-minicursos" target="page"> github</a>
          { gerenciar }
          { admin }
          { login }
        </footer>
      </div>
    )
  }
}
