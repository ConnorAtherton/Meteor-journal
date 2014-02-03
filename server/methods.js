Meteor.methods({
  /**
  *
  * Used when a user first creates an entry
  * from their home dashboard
  *
  **/
  insertArticle: function (fields) {
    var currentEntry = Entries.insert({
      title: fields.title,
      body: fields.body,
      owner: Meteor.userId(),
      owners:[Meteor.userId()],
      lastUpdated: new Date().valueOf(),
      lastUserToModify: Meteor.userId()
    });

    return currentEntry;
  },

  /**
  *
  * Called when a user is editing a document
  *
  **/
  updateArticle: function (fields) {
    var time = new Date().valueOf();
    // update document if it is already in the database
    // otherwise insert a new one (with upsert: true)
    // Shouldn't need to do an upsert though!!!
    Entries.update(
      { _id: fields.docId },
      {
        title: fields.title,
        body: fields.body,
        lastUpdated: time,
        lastUserToModify: Meteor.userId()
      }
    )

    return fields.docId ;
  }
});
