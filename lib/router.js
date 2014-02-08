/*=====================================
=            Configuration            =
=====================================*/

Router.configure({
  layoutTemplate: 'body',
  loadingTemplate: 'loading',
  notFoundTemplate: '404'
});

/**
*
* Filters
*
**/

var filters = {

  nProgressHook: function () {
    if (this.ready()) {
      NProgress.done();
    } else {
      NProgress.start();
      this.stop();
    }
  },

  resetScroll: function () {
    var scrollTo = window.currentScroll || 0;
    $('body').scrollTop(scrollTo);
    $('body').css("min-height", 0);
  },

  isLoggedIn: function() {
    if (!(Meteor.loggingIn() || Meteor.user())) {
      console.log('Please sign in biatch')
      this.render('signin');
      this.stop();
    }
  }
}

// Use nProgress on every route that has to load a subscription
Router.before(filters.nProgressHook, {only: [
  'editor',
  'home'
]});

Router.before(filters.isLoggedIn, {only: [

]});


/**
*
* Define route Controllers
*
**/
var EditorController = FastRender.RouteController.extend({
  template:'editor',
  waitOn: function () {
    return [
    ]
  },
  data: function () {
    return {
    }
  },
  after: function() {

  }
});

HomeController = FastRender.RouteController.extend({
  template: 'home',
  waitOn: function () {
    return Meteor.subscribe('entries')
  },
  data: function () {
    return {
      user: name
    }
  },
  after: function() {

  }
});

DocumentController = FastRender.RouteController.extend({
  template: 'documentEditor',
  waitOn: function () {
    return [
      Meteor.subscribe('entries')
    ]
  },
  before: function () {
    /**
    *
    * Make sure that the id is valid and that a
    * document actually exists. if it doesn't we can
    *  - Navigate back home
    *  - Just create a new one blank document
    *
    **/
    var id = this.params.document,
        entry = Entries.find({ _id: id }).fetch();

      console.log('this is the entry ', id, entry)

    if (entry.length === 0) {
      goHome();
    }
    else {
      Session.set('currentEntry', id);
    }

  },
  after: function() {

  }
});

/**
*
* Define all routes
*
**/

Router.map(function () {

  this.route('editor', {
    path: '/',
    controller: EditorController
  }),

  this.route('home', {
    path: '/:name',
    controller: HomeController
  }),

  this.route('document', {
    path: '/:name/:document',
    controller: DocumentController
  })

})


