import { Minicursos } from "../collections.js";

Meteor.publish('minicursos', ()=>{
  return Minicursos.find({});
})
