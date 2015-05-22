Cursos = new Mongo.Collection('cursos');
Users = Meteor.users;

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

if (Meteor.isClient) {
  Session.setDefault('isAdmin', false);

  getCursos = function(){
    return Cursos.find();
  };

  getCursosIdIn = function(ids){
    return Cursos.find({
      '_id':{$in: ids}
    });
  }

  getCheckedCheckboxesValues = function(cbs){
    var checkedCbs = [];
    for(x in cbs)
      if(cbs[x].checked === true)
        checkedCbs.push(cbs[x].value);
    return checkedCbs;
  }

  Deps.autorun(function(){
    if(Meteor.user()){
      Meteor.subscribe('users',Meteor.user());
    }
    Meteor.subscribe('cursos',Meteor.user());
    Session.set('isAdmin', (Meteor.user() && Meteor.user().admin) === true);
  });

  Template.body.helpers({
    isAdmin: function(){
      return Session.get('isAdmin');
    },
    cursos: function(){
      return getCursos().count() > 0;
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
    },
    showParticipantes: function(){
      return this._id === Session.get('idShowParticipantes');
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
      var cpf = event.target.cpf.value;
      var email = event.target.email.value;
      var cursos = event.target.cursos;

      //Fix para quando tem só um curso, pq target.cursos retorna apenas 1
      // objeto, e não um array com 1 objeto
      if(cursos.length === undefined)
        cursos = [].concat(cursos);

      var participante = {'_id':Random.id(),'nome':nome,'cpf':cpf,'email':email};

      cursos = getCheckedCheckboxesValues(cursos);
      cursos = getCursosIdIn(cursos);
      cursos = cursos.fetch();

      for(x in cursos)
        Meteor.call('addParticipante',cursos[x],participante);

      // TODO: esvaziar campos
      // TODO: retornar mensagem de sucesso/erro

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
    'click .show-participantes': function(event){
      if(Session.get('idShowParticipantes') === this._id)
        Session.set('idShowParticipantes','');
      else
        Session.set('idShowParticipantes',this._id);
    },
    'click .removeCurso': function(event){
      if(confirm('Tem certeza que deseja excluir esse curso?'))
        Meteor.call('removeCurso', this);
    },
    'click .disabled, click .enabled': function(event){
      Meteor.call('toggleCursoEnabled', this);
    },
    'click .printChamada': function(event){
      window.alert('BANANA');
    }
  });

  Template.controlParticipante.events({
    'click .removeParticipante': function(event){
      if(confirm('Tem certeza que deseja excluir o participante desse curso?'))
        Meteor.call('removeParticipante',this);
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
  isAdmin: function(){
    return (Meteor.user() && Meteor.user().admin) === true;
  },
  createCurso: function(nome){
    if(!Meteor.call('isAdmin'))
      return;

    Cursos.insert({
      'nome': nome
    });
  },
  editCurso: function(curso,nome,descricao){
    if(!Meteor.call('isAdmin'))
      return;

    Cursos.update({
      '_id': curso._id
    },{$set:{
      'nome': nome,
      'descricao': descricao
    }});
  },
  removeCurso: function(curso){
    if(!Meteor.call('isAdmin'))
      return;

    Cursos.remove({
      '_id': curso._id
    });
  },
  toggleCursoEnabled: function(curso){
    if(!Meteor.call('isAdmin'))
      return;

    Cursos.update({
      '_id': curso._id
    },{$set:{
      'habilitado': ! curso.habilitado
    }});
  },
  addParticipante: function(curso, participante){
    Cursos.update({
      '_id': curso._id
    },{$push:{
      'participantes': participante
    }});
  },
  removeParticipante: function(participante){
    Cursos.update({
    },{$pull:{
      'participantes':{
        '_id': participante._id
      }
    }});
  },
  toggleUserAdmin: function(user){
    if(!Meteor.call('isAdmin'))
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
