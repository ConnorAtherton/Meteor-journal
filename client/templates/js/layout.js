Template.body.events({
  /**
  *
  * Really need to come back to this piece of shit.
  * Ask digilord how event maps are handled in accounts ui or something like that
  *
  **/

  'click': hideLogin,

});

/**
*
* Trying to get round an issue with meteor when trying to
* cl;ick the body element. See here
* https://groups.google.com/forum/?fromgroups=#!topic/meteor-talk/uHy--xIGH8o.
*
**/

Template.body.rendered = function () {
  $('body').on('click', hideLogin);
};
