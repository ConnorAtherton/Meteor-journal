Template.uiElements.events({
  'click .home': homeClicked,

  'click .save': saveClicked,
});

/**
*
* Called when the home icon is clicked.
*
**/

function homeClicked(e, tmpl) {
  // Go to the home page if the user is logged in
  if(Meteor.userId())
    return goHome();

  // save the state
  Session.set('loginOpen', true);
  $('body').addClass('loginOpen');

    // logged in so show the login via twitter
    showLoginHome('.home');
}

/**
*
* Called when the save icon is clicked
*
**/

function saveClicked(e, tmpl) {
  if (!Meteor.userId()) {
    // logged in so show the login via twitter
    // but in the top left
    showLoginHome('.home');
    // but save to localStorage for them
    editor.saveState();
  }

  // Save the article in the database
  // or local storage if the user isn't logged in

}

