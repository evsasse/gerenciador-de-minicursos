Cursos = new Mongo.Collection('cursos');

if (Meteor.isClient) {
  Meteor.subscribe('cursos');
  Meteor.subscribe('isAdmin');

  Template.body.helpers({
    isAdmin: function(){
      Meteor.call('isAdmin', function(err,data){
        if(err) console.log(err);
        Session.set('isAdmin',data);
      });
      return Session.get('isAdmin');
    }
  });
}

Meteor.methods({
  isAdmin: function(){
    var user = Meteor.users.findOne({'_id':Meteor.userId()},{'admin':1})
    if(user && user.hasOwnProperty('admin') && user.admin === true)
      return true;
    return false;
  }
});

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.publish('cursos',function(){
      return Cursos.find();
    });
    Meteor.publish('isAdmin',function(){
      return Meteor.users.find({'_id':this.userId},{'admin':1});
    });
  });
}
