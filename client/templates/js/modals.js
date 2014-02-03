Template.modals.events({
  'click #loginWithTwitter': function () {
    Meteor.loginWithTwitter({},
      function (err) {
        if(err) {
          // do something with the eroor
          console.log(err);
        }
        else {
          placeLoginOffScreen();
          goHome();
        }
      }
    );
  }
});
