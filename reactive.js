Cursos = new Mongo.Collection('cursos');
Users = Meteor.users;

getCursos = function(){
  return Cursos.find();
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

if (Meteor.isClient) {
  Session.setDefault('isAdmin', false);

  Deps.autorun(function(){
    if(Meteor.user()){
      Meteor.subscribe('users',Meteor.user());
    }
    Meteor.subscribe('cursos',Meteor.user());
    Session.set('isAdmin', (Meteor.user() && Meteor.user().admin) === true);
    //console.log(Session.get('isAdmin'));
  });

  Template.body.helpers({
    isAdmin: function(){
      return Session.get('isAdmin');
    }
  });

  Template.formInscricao.helpers({
    cursos: function(){
      return getCursos();
    },
    isAdmin: function(){
      return Session.get('isAdmin');
    }
  });

  Template.controlCursos.helpers({
    cursos: function(){
      return getCursos();
    }
  });

  Template.controlCurso.helpers({
    showEdit: function(){
      return this._id === Session.get('idShowEdit');
    }
  });

  Template.controlAdmins.helpers({
    users: function(){
      return Users.find();
    }
  })

////////////////////////////////////////////////////////////////////////////////

  Template.formInscricao.events({
    'submit #form-inscricao': function(event){
      event.preventDefault();

      var nome = event.target.nome.value;

      Meteor.call('createCurso',nome);

      event.target.nome.value = '';

      return false;
    }
  });

  Template.controlCursos.events({
    'submit #create-curso': function(event){
      event.preventDefault();

      var nome = event.target.nome.value;

      // TODO: verificar se o campo não está vazio, retornar erro(?)

      Meteor.call('createCurso', nome);

      event.target.nome.value = '';

      return false;
    }
  });

  Template.controlCurso.events({
    'submit .edit-curso': function(event){
      event.preventDefault();

      var nome = event.target.nome.value;
      var descricao = event.target.descricao.value;

      // TODO: verificar se o campo não está vazio, retornar erro(?)

      Meteor.call('editCurso', this, nome, descricao);

      return false;
    },
    'click .show-edit': function(event){
      if(Session.get('idShowEdit') === this._id)
        Session.set('idShowEdit','');
      else
        Session.set('idShowEdit',this._id);
    },
    'click .remove': function(event){
      if(confirm('Tem certeza que deseja excluir esse curso?'))
        Meteor.call('removeCurso', this);
    },
    'click .disabled, click .enabled': function(event){
      Meteor.call('toggleCursoEnabled', this);
    }
  });

  Template.controlAdmin.events({
    'click .disabled, click .enabled': function(event){
      Meteor.call('toggleUserAdmin', this);
    }
  });
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

Meteor.methods({
  createCurso: function(nome){
    if(!Session.get('isAdmin'))
      return;

    Cursos.insert({
      'nome': nome
    });
  },
  editCurso: function(curso,nome,descricao){
    if(!Session.get('isAdmin'))
      return;

    Cursos.update({
      '_id': curso._id
    },{$set:{
      'nome': nome,
      'descricao': descricao
    }});
  },
  removeCurso: function(curso){
    if(!Session.get('isAdmin'))
      return;

    Cursos.remove({
      '_id': curso._id
    });
  },
  toggleCursoEnabled: function(curso){
    if(!Session.get('isAdmin'))
      return;

    Cursos.update({
      '_id': curso._id
    },{$set:{
      'habilitado': ! curso.habilitado
    }});
  },
  toggleUserAdmin: function(user){
    if(!Session.get('isAdmin'))
      return;

    Users.update({
      '_id': user._id
    },{$set:{
      'admin': ! user.admin
    }});
  }
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

if (Meteor.isServer) {
  Meteor.publish('users', function(user){
    if((user && user.admin) === true)
      return Users.find();
    return Users.find({
      '_id': user._id
    });
  });
  Meteor.publish('cursos', function(user){

    // TODO: retornar apenas os curso disponíveis e dados como _id, nome e descricao se não for admin

    if((user && user.admin) === true)
      return Cursos.find();
    return Cursos.find({
      'habilitado': true
    });
  })
}
