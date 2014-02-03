Entries = new Meteor.Collection('entries');

/**
*
* Come back and add more sophisticated rules here.
*
**/

Entries.allow({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    return true;
  },
  remove: function (userId, doc) {
    return true;
  },
  fetch: ['owner']
});
