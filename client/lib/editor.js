editor = (function(Meteor) {

  // Editor elements
  var headerField, contentField, wordCountField, cleanSlate, lastType, currentNodeList, savedSelection;

  // Editor Bubble elements
  var textOptions, optionsBox, boldButton, italicButton, quoteButton, urlButton, urlInput;

  function init() {

    lastRange = 0;
    bindElements();

    // Set cursor position
    var range = document.createRange();
    var selection = window.getSelection();
    // range.setStart(contentField, 1);
    selection.removeAllRanges();
    selection.addRange(range);

    createEventBindings();

   /**

     TODO:
     - Fill in the content from mongo collections
     - Second todo item

   **/
  }

  function createEventBindings( on ) {

    // Key up bindings
    if ( supportsHtmlStorage() ) {

      document.onkeyup = function( event ) {
        checkTextHighlighting( event );
      }

    } else {
      document.onkeyup = checkTextHighlighting;
    }

    // Mouse bindings
    document.onmousedown = checkTextHighlighting;
    document.onmouseup = function( event ) {

      setTimeout( function() {
        checkTextHighlighting( event );
      }, 1);
    };

    // Window bindings
    window.addEventListener( 'resize', function( event ) {
      updateBubblePosition();
    });

    // Scroll bindings. We limit the events, to free the ui
    // thread and prevent stuttering. See:
    // http://ejohn.org/blog/learning-from-twitter
    var scrollEnabled = true;
    document.body.addEventListener( 'scroll', function() {

      if ( !scrollEnabled ) {
        return;
      }

      scrollEnabled = true;

      updateBubblePosition();

      return setTimeout((function() {
        scrollEnabled = true;
      }), 250);
    });
  }

  function bindElements() {

    headerField = document.querySelector( '.header' );
    contentField = document.querySelector( '.content' );
    textOptions = document.querySelector( '.text-options' );

    optionsBox = textOptions.querySelector( '.options' );

    boldButton = textOptions.querySelector( '.bold' );
    boldButton.onclick = onBoldClick;

    italicButton = textOptions.querySelector( '.italic' );
    italicButton.onclick = onItalicClick;

    quoteButton = textOptions.querySelector( '.quote' );
    quoteButton.onclick = onQuoteClick;

    urlButton = textOptions.querySelector( '.url' );
    urlButton.onmousedown = onUrlClick;

    urlInput = textOptions.querySelector( '.url-input' );
    urlInput.onblur = onUrlInputBlur;
    urlInput.onkeydown = onUrlInputKeyDown;
  }

  function checkTextHighlighting( event ) {

    var selection = window.getSelection();

    if ( (event.target.className === "url-input" ||
         event.target.classList.contains( "url" ) ||
         event.target.parentNode.classList.contains( "ui-inputs")) ) {

      currentNodeList = findNodes( selection.focusNode );
      updateBubbleStates();
      return;
    }

    // Check selections exist
    if ( selection.isCollapsed === true && lastType === false ) {

      onSelectorBlur();
    }

    // Text is selected
    if ( selection.isCollapsed === false ) {

      currentNodeList = findNodes( selection.focusNode );

      // Find if highlighting is in the editable area
      if ( hasNode( currentNodeList, "ARTICLE") ) {
        updateBubbleStates();
        updateBubblePosition();

        // Show the ui bubble
        textOptions.className = "text-options active";
      }
    }

    lastType = selection.isCollapsed;
  }

  function updateBubblePosition() {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var boundary = range.getBoundingClientRect();

    textOptions.style.top = boundary.top - 5 + window.pageYOffset + "px";
    textOptions.style.left = (boundary.left + boundary.right)/2 + "px";
  }

  function updateBubbleStates() {
    if ( hasNode( currentNodeList, 'B') ) {
      boldButton.className = "bold active"
    } else {
      boldButton.className = "bold"
    }

    if ( hasNode( currentNodeList, 'I') ) {
      italicButton.className = "italic active"
    } else {
      italicButton.className = "italic"
    }

    if ( hasNode( currentNodeList, 'BLOCKQUOTE') ) {
      quoteButton.className = "quote active"
    } else {
      quoteButton.className = "quote"
    }

    if ( hasNode( currentNodeList, 'A') ) {
      urlButton.className = "url icon-link active"
    } else {
      urlButton.className = "url icon-link"
    }
  }

  function onSelectorBlur() {

    textOptions.className = "text-options fade";
    setTimeout( function() {

      if (textOptions.className == "text-options fade") {

        textOptions.className = "text-options";
        textOptions.style.top = '-999px';
        textOptions.style.left = '-999px';
      }
    }, 260 )
  }

  function findNodes( element ) {

    var nodeNames = {};

    while ( element.parentNode ) {

      nodeNames[element.nodeName] = true;
      element = element.parentNode;

      if ( element.nodeName === 'A' ) {
        nodeNames.url = element.href;
      }
    }

    return nodeNames;
  }

  function hasNode( nodeList, name ) {
    return !!nodeList[ name ];
  }

  function onBoldClick() {
    document.execCommand( 'bold', false );
  }

  function onItalicClick() {
    document.execCommand( 'italic', false );
  }

  function onQuoteClick() {

    var nodeNames = findNodes( window.getSelection().focusNode );

    if ( hasNode( nodeNames, 'BLOCKQUOTE' ) ) {
      document.execCommand( 'formatBlock', false, 'p' );
      document.execCommand( 'outdent' );
    } else {
      document.execCommand( 'formatBlock', false, 'blockquote' );
    }
  }

  function onUrlClick() {

    if ( optionsBox.className == 'options' ) {

      optionsBox.className = 'options url-mode';

      // Set timeout here to debounce the focus action
      setTimeout( function() {

        var nodeNames = findNodes( window.getSelection().focusNode );

        if ( hasNode( nodeNames , "A" ) ) {
          urlInput.value = nodeNames.url;
        } else {
          // Symbolize text turning into a link, which is temporary, and will never be seen.
          document.execCommand( 'createLink', false, '/' );
        }

        // Since typing in the input box kills the highlighted text we need
        // to save this selection, to add the url link if it is provided.
        lastSelection = window.getSelection().getRangeAt(0);
        lastType = false;

        urlInput.focus();

      }, 100);

    } else {
      optionsBox.className = 'options';
    }
  }

  function onUrlInputKeyDown( event ) {

    if ( event.keyCode === 13 ) {
      event.preventDefault();
      applyURL( urlInput.value );
      urlInput.blur();
    }
  }

  function onUrlInputBlur( event ) {

    optionsBox.className = 'options';
    applyURL( urlInput.value );
    urlInput.value = '';

    currentNodeList = findNodes( window.getSelection().focusNode );
    updateBubbleStates();
  }

  function applyURL( url ) {

    rehighlightLastSelection();

    // Unlink any current links
    document.execCommand( 'unlink', false );

    if (url !== "") {

      // Insert HTTP if it doesn't exist.
      if ( !url.match("^(http|https)://") ) {

        url = "http://" + url;
      }

      document.execCommand( 'createLink', false, url );
    }
  }

  function rehighlightLastSelection() {
    window.getSelection().addRange( lastSelection );
  }

  function getWordCount() {
    var text = get_text( contentField );

    if ( text === "" ) {
      return 0;
    } else {
      return text.split(/\s+/).length;
    }
  }

  function loadState() {
    /**
    *
    * If we are logged in and a current entry is
    * stored, meaning we have been editing, we find
    * the doc and populate editor;
    *
    * Note: we should instead redirect to the correct route
    * if the user is already logged in. (/:name/:document)
    *
    **/

    if(Meteor.user() && Session.get('currentEntry')) {
      console.log('load from the monogdbv')
      var doc = Entries.find({_id: Session.get('currentEntry')})

      headerField.innerHTML = doc.title;
      contentField.innerHTML = doc.body;
      return ui.updateWordCount();
    }

    console.log('load from localstorage');

    /**
    *
    * Else we try and load from localstorage. If
    * the browser doesn't support it then it just doesn't
    * save unless they log in first
    *
    **/

    if ( localStorage['header'] && localStorage[ 'header' ] !== "undefined") {
      headerField.innerHTML = localStorage['header'];
    }
    if ( localStorage['article'] ) {
      contentField.innerHTML = localStorage['article'];
    }

    ui.updateWordCount();
  }

  function saveState() {

    if(Meteor.user()) {
      if(Session.get('currentEntry')) {
        update()
      }
      else {

        insert();
      }
      return;
    }

    if ( supportsHtmlStorage() ) {
      localStorage[ 'wordCount' ] = 500;
      localStorage[ 'header' ] = headerField.innerHTML;
      localStorage[ 'article' ] = contentField.innerHTML;
    }
  }

  function insert () {
    Meteor.call('insertArticle', {
      title: headerField.innerHTML,
      body: contentField.innerHTML
    }, function (err, id) {
      if(err)
        console.log(err)

      console.log('Returning from the insert', id)

      Session.set('currentEntry', id);
    });
  }

  function update () {
    Meteor.call('updateArticle', {
      docId: Session.get('currentEntry'),
      title: headerField.innerHTML,
      body: contentField.innerHTML
    }, function (err, id) {
      if(err)
        console.log(err)
      console.log('Returning from the update', id)
      Session.set('currentEntry', id);
    });
  }

  return {
    init: init,
    saveState: saveState,
    loadState: loadState,
    getWordCount: getWordCount
  }

})(Meteor);
