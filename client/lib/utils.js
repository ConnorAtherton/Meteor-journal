/**
*
* Mostlu used for older IE browsers
*
**/

String.prototype.trim = function(){ return this.replace(/^\s+|\s+$/g, ''); };

supportsHtmlStorage = function() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

get_text = function(el) {
    ret = " ";
    var length = el.childNodes.length;
    for(var i = 0; i < length; i++) {
        var node = el.childNodes[i];
        if(node.nodeType != 8) {

          if ( node.nodeType != 1 ) {
            // Strip white space.
            ret += node.nodeValue;
          } else {
            ret += get_text( node );
          }
        }
    }
    return ret.trim();
}

/**
*
* Classes of events that when clicked on should not close
* the login modal. There must be a better way to do this
* but it's a bit of a workaround to handle template logio.
*
**/
var stopPropagation = ['home', 'save', 'login', 'login-inner', 'word-count', 'progress', 'dont-hide'];

showLoginHome = function (str) {
  var el = $(str),
      arrow = $('.login-arrow');

  var offset = el.offset(),
      height = el.height(),
      width = el.width(),
      position = el.position();

  $('.login').css({
    top: offset.top - 20,
    left: offset.left + width
  }).addClass('fade');

  arrow.addClass('arrow-left');

}

hideLogin = function (e, tmpl) {
    e.stopPropagation();
    var target = $(e.target);

    for (var i = 0; i < stopPropagation.length; i++) {
      if(target.hasClass(stopPropagation[i]) || target.parent().hasClass(stopPropagation[i]) )
        return false;
    };

    placeLoginOffScreen();
}

placeLoginOffScreen = function() {
  $('.login').removeClass('fade');
  $('.login').css({
    top: -999,
    left: -999
  });
}

/**
*
* Navigate the user back home when they are logged in or
* back to the editor if they aren't
*
**/
goHome = function () {
  if(Meteor.userId()) {
    Router.go('home', {
      name: Meteor.user().services.twitter.screenName
    });
  } else {
    Router.go('editor');
  }
}
