Cursos = new Mongo.Collection('cursos');
Users = Meteor.users;

if (Meteor.isClient) {
  Session.set('isAdmin',false);

  Meteor.subscribe('cursosDisponiveis');
  Meteor.subscribe('currentUser');

  Template.body.helpers({
    isAdmin: function(){
      Meteor.call('isAdmin', function(err,data){
        if(err) console.log(err);
        Session.set('isAdmin',data);
        if(data){
          Meteor.subscribe('allUsers');
          Meteor.subscribe('allCursos');
        }
      });
      return Session.get('isAdmin');
    }
  });
  Template.formInscricao.helpers({
    cursos: function(){
      var cursos = Cursos.find({'habilitado':true});
      if(cursos.count() > 0)
        return cursos;
      return false;
    }
  });
  Template.formEditCursos.helpers({
    cursos: function(){
      var cursos = Cursos.find({});
      if(cursos.count() > 0)
        return cursos;
      return false;
    }
  });
  Template.formAdmin.helpers({
    users: function(){
      return Users.find({});
    }
  });

  Template.user.events({
    "click .admin_checkbox": function(){
      Meteor.call('changeAdmin',this);
    }
  });

}

Meteor.methods({
  isAdmin: function(){
    var user = Meteor.users.findOne({'_id':Meteor.userId()},{'admin':1})
    if(user && user.hasOwnProperty('admin') && user.admin === true)
      return true;
    return false;
  },
  changeAdmin: function(user){
    if(Meteor.call('isAdmin'))
      Users.update({'_id':user._id},{$set:{'admin':!user.admin}});
  }
});

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.publish('allCursos',function(){
      return Cursos.find({});
    });
    Meteor.publish('cursosDisponiveis',function(){
      return Cursos.find({'habilitado':true});
    });
    Meteor.publish('currentUser',function(){
      return Meteor.users.find({'_id':this.userId},{'admin':1});
    });
    Meteor.publish('allUsers',function(){
      return Users.find({});
    });
  });
}
