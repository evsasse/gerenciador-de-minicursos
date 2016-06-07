import React, { Component } from 'react';
import { composeWithTracker } from 'react-komposer';

import { Minicursos } from "../collections.js";
import Minicurso from "./Minicurso.jsx";

class GerenciarMinicursos extends Component{
  render(){
    let { minicursos } = this.props;
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

function composer(props, onData) {
  const handle = Meteor.subscribe('minicursos');
  if(handle.ready()) {
    const minicursos = Minicursos.find({}).fetch();
    onData(null, {minicursos});
  };
};

export default composeWithTracker(composer)(GerenciarMinicursos);
