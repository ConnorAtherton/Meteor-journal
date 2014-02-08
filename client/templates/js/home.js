Template.home.entries = function () {
  // Sort this by most recent date
  return Entries.find({});
}

Template.home.helpers({
  screenName: function () {
    return 'Gus'; //Meteor.user().services.twitter.screenName
  }
});

Template.home.events({
  'click #createNew': createNew,
});


/**
*
* Block comment
*
**/
function createNew() {
  Meteor.call('insertArticle', {
      title: 'this is an example title',
      body: null
    }, function (err, id) {
      if(err) console.log(err)

      Session.set('currentEntry', id);
      Router.go('document', {
        name: Meteor.user().services.twitter.screenName,
        document: Session.get('currentEntry')
      })
    });
}
