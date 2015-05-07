Cursos = new Mongo.Collection('cursos');

if (Meteor.isClient) {
  Meteor.subscribe('cursos');

  getCursos = function(){
    return Cursos.find();
  };

  Template.formInscricao.helpers({
    cursos: function(){
      return getCursos();
    }
  })

  Template.controlCursos.helpers({
    cursos: function(){
      return getCursos();
    }
  });

  Template.controlCursos.events({
    'submit #create-curso': function(event){
      // pega o valor no campo do formulario
      var nome = event.target.nome.value;

      // TODO: verificar se o campo não está vazio, retornar erro(?)

      // insere no bd
      Meteor.call('createCurso', nome);

      // limpa o campo do formulario
      event.target.text.value = '';

      // impede que redirecione
      return false;
    }
  });

  Template.controlCurso.events({
    'submit .edit-curso': function(event){
      // pega o valor dos campos do formulario
      var id = event.target.id.value;
      var nome = event.target.nome.value;
      var descricao = event.target.descricao.value;

      // TODO: verificar se o campo não está vazio, retornar erro(?)

      // edita no bd
      Meteor.call('editCurso', id, nome, descricao);

      return false;
    }
  });
}

Meteor.methods({
  createCurso: function(nome){

    // TODO: verificar se é admin

    Cursos.insert({
      'nome': nome
    });
  },
  editCurso: function(id,nome,descricao){

    // TODO: verificar se é admin

    Cursos.update({
      '_id': id
    },{$set:{
      'nome': nome,
      'descricao': descricao
    }});
  },
  addParticipante: function(curso,nome,cpf,email){

  }
});

if (Meteor.isServer) {
  Meteor.publish('cursos', function(){

    // TODO: retornar apenas os curso disponíveis e dados como _id, nome e descricao se não for admin

    return Cursos.find();
  })
}
