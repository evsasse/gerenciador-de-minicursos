Cursos = new Mongo.Collection('cursos');
Users = Meteor.users;

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

if (Meteor.isClient) {
  Session.setDefault('isAdmin', false);

  Meteor.startup(function() {
    reCAPTCHA.config({
      theme: 'light',  // 'light' default or 'dark'
      publickey: '6LeW4gETAAAAANh0Q4mAYrh1Y65DiZHPCOeFuxs7'
    });
  });

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
      Meteor.call('checkIfFirstUser');
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
      if(cursos.length === 0){
        window.alert('Nenhum curso foi selecionado');
        return
      }
      cursos = getCursosIdIn(cursos);
      cursos = cursos.fetch();

      recaptcha = $('#g-recaptcha-response').val();

      Meteor.call('inscreverParticipante', cursos, participante, recaptcha, function(err,data){
        if(err){
          if (err.error === 'ERROR_CAPTCHA') {
            window.alert('Preencha o Captcha corretamente');
            return
          }
        }else{
          str = 'Foi foi inscrito nos seguintes cursos:\n';
          for(x in cursos){
            curso = cursos[x]
            str += ' => ' + curso.nome + '\n';
          }
          window.alert(str)
          location.reload()
        }
      });

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
      var columns = [
          {title: "Nome", key: "nome"},
          {title: "Assinatura", key: null}
      ];
      var data = this.participantes;

      var doc = new jsPDF('p', 'pt');
      doc.autoTable(columns, data, {});
      doc.output('dataurlnewwindow');
    },
    'click .toText': function(event){
      var qtd = window.prompt('Transformar em texto formatado para Certificados UFSC\n\n'
        + 'Considerar participantes com pelo menos quantas presenças?\n'
        + '(Deixe vazio se deseja considerar todos os inscritos)\n'
        + 'PS: Apenas participantes com CPF cadastrados serão considerados!');
      var considerados = [];

      for(var i in this.participantes){
        if(qtd > 0 && this.participantes[i].presenca >= qtd && this.participantes[i].cpf != '')
          considerados.push(this.participantes[i]);
        else if(!(qtd > 0) && this.participantes[i].cpf != '')
          considerados.push(this.participantes[i]);
      }

      var toText = '';
      for(var i in considerados){
        toText += considerados[i].cpf + ';' + considerados[i].nome + '\n';
      }

      if(toText == ''){
        window.alert('Nenhum inscrito, com CPF, corresponde a esse número de presenças');
      }else{
        var base64 = btoa(unescape(encodeURIComponent(toText)));
        window.open("data:text/plain;charset=UTF-8;base64,"+base64,"UTF-8 Text");
      }
    }
  });

  Template.controlParticipante.events({
    'click .removeParticipante': function(event){
      if(confirm('Tem certeza que deseja excluir o participante desse curso?'))
        Meteor.call('removeParticipante',this);
    },
    'change .presenca': function(event){
      Meteor.call('changeParticipantePresenca',this,event.target.value);
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
  inscreverParticipante: function(cursos, participante, recaptcha){
    // for(x in cursos)
    //   Meteor.call('addParticipante', cursos[x], participante, recaptcha, function(err,data){
    //     if(err && err.error === 'ERROR_FULL'){
    //       window.alert('Curso ' + cursos[x].nome + 'está cheio :/\n'
    //       + 'Contate alguém do PET para verificar se há mais vagas')
    //       return
    //     }else if(err && err.error === 'ERROR_CAPTCHA'){
    //       window.alert('Preencha o Captcha corretamente')
    //       return
    //     }
    //   });
    if(!Meteor.isServer)
      return

    var verifyCaptchaResponse = reCAPTCHA.verifyCaptcha(this.connection.clientAddress, recaptcha);
    if( verifyCaptchaResponse.data.success === false )
      throw new Meteor.Error('ERROR_CAPTCHA','Captcha wasnt filled or was wrongly filled')

    errors = []

    for(x in cursos){
      curso = cursos[x];
      try {
        addParticipante(curso, participante)
      } catch (err) {
        if(err.error === 'ERROR_FULL')
          errors.push(err.error)
        else
          throw err;
      }
    }
  },
  // addParticipante: function(curso, participante, recaptcha){
  //   if(Meteor.isServer){
  //     var verifyCaptchaResponse = reCAPTCHA.verifyCaptcha(this.connection.clientAddress, recaptcha);
  //     if( verifyCaptchaResponse.data.success === false ){
  //       throw new Meteor.Error('ERROR_CAPTCHA','Captcha wasnt filled or was wrongly filled')
  //     }
  //
  //     Cursos.update({
  //       '_id': curso._id
  //     },{$push:{
  //       'participantes': participante
  //     }});
  //   }
  // },
  removeParticipante: function(participante){
    if(!Meteor.call('isAdmin'))
      return;

    Cursos.update({
    },{$pull:{
      'participantes':{
        '_id': participante._id
      }
    }},{
      multi: true
    });
  },
  changeParticipantePresenca: function(participante,value){
    if(!Meteor.call('isAdmin'))
      return;

    Cursos.update({
      'participantes._id': participante._id
    },{$set:{
      'participantes.$.presenca': value
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
  },
  checkIfFirstUser: function(user){
    if(Meteor.isServer){ // Fix for latency compensation flickering, as the client kept guessing wrong >:(
      var users = Users.find({}).count();

      if(users === 1)
        Users.update({},{$set:{
          'admin': true
        }});
    }
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

  addParticipante = function(curso, participante){
    Cursos.update({
      '_id': curso._id
    },{$push:{
      'participantes': participante
    }});
  }
}
