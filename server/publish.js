/**
*
* Publish to null so meteor will merge the fields
* into the already created users collection.
*
**/

Meteor.publish(null, function () {
  return Meteor.users.find(
    {

    },
    {
      'services.twitter.screenName': true,
      'services.twitter.profile_image_url': true,
      'services.twitter.profile_image_url_https': true
    }
  );
});

/**
*
* Publish all entries that the user owns..
* Note: because of collaboration a document can
* be owned by more than one person.
*
**/

Meteor.publish('entries', function () {
  return Entries.find({ owners: this.userId }, {});
});
