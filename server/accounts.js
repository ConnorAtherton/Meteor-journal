TwitMaker = Meteor.require('twit');

Accounts.onCreateUser(function (options, user) {

  twit = new TwitMaker({
      consumer_key:         'GhRZNO01evVYGcSZjfmkQ'
    , consumer_secret:      'nNtnxoVVVazYNYzybMLFHjUKIYeOkWxJoT5dktmAHP8'
    , access_token:         user.services.twitter.accessToken
    , access_token_secret:  user.services.twitter.accessTokenSecret
  });

  twit.get('users/show', {
    user_id: Meteor.userId(),
    screen_name: user.services.twitter.screenName
  }, function(err, reply) {

    var profile = _.pick(reply,
      'screen_name',
      'profile_image_url',
      'profile_image_url_https'
    );

    user.profile = profile;

  });

  return user;
});
