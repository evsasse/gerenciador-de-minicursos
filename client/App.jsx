import React, {Component} from "react";
import { composeWithTracker } from 'react-komposer';

import { Minicursos } from "../collections.js";

class App extends Component{
  getChildContext(){
    return {
      minicursos: this.props.minicursos
    }
  }

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
      <a href="/login"> login</a>
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
          <a href="https://github.com/evsasse/gerenciador-de-minicursos" target="page"> github</a>
          { gerenciar }
          { admin }
          { login }
        </footer>
      </div>
    )
  }
}

App.childContextTypes = {
  minicursos: React.PropTypes.array
}

function composer(props, onData) {
  const handle = Meteor.subscribe('minicursos');
  if(handle.ready()) {
    const minicursos = Minicursos.find({}).fetch();
    onData(null, {minicursos});
  };
};

export default composeWithTracker(composer)(App);
