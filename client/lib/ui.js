ui = (function() {

  // Base elements
  var body, article, wordCountField, uiContainer, overlay, aboutButton, descriptionModal;

  // Buttons
  var screenSizeElement, colorLayoutElement, targetElement, saveElement;

  // Work Counter
  var wordCountValue, wordCountBox, wordCountElement, wordCounter, wordCounterProgress;

  //save support
  var supportSave, saveFormat, textToWrite, saveInterval;

  var expandScreenIcon = '&#xe000;';
  var shrinkScreenIcon = '&#xe004;';

  var darkLayout = false;

  function init() {

    saveInterval = 5000;
    wordCountValue = 50;

    bindElements();

    wordCountActive = false;

    if ( supportsHtmlStorage() ) {
      editor.loadState();
    }

    window.setInterval(function () {
      editor.saveState();
    }, saveInterval)

  }

  function bindElements() {

    // Body element for light/dark styles
    body = document.body;

    uiContainer = document.querySelector( '.ui' );

    // UI element for full screen
    // screenSizeElement = document.querySelector( '.fullscreen' );
    // screenSizeElement.onclick = onScreenSizeClick;:

    document.addEventListener( "fullscreenchange", function () {
      if ( document.fullscreenEnabled === false ) {
        exitFullscreen();
      }
    }, false);

    article = document.querySelector( '.content' );
    article.onkeyup = onArticleKeyUp;

    wordCountField = document.querySelector( '.word-count' );

    wordCounter = document.querySelector( '.word-counter' );
    wordCounterProgress = wordCounter.querySelector( '.progress' );

    header = document.querySelector( '.header' );
    header.onkeypress = onHeaderKeyPress;
  }

  function onScreenSizeClick( event ) {

    if ( !document.fullscreenElement ) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  }

  function enterFullscreen() {
    document.body.requestFullscreen( Element.ALLOW_KEYBOARD_INPUT );
    screenSizeElement.innerHTML = shrinkScreenIcon;
  }

  function exitFullscreen() {
    document.exitFullscreen();
    screenSizeElement.innerHTML = expandScreenIcon;
  }

  function onTargetClick( event ) {
    overlay.style.display = "block";
    wordCountBox.style.display = "block";
    wordCountElement.focus();
  }

  function onAboutButtonClick( event ) {
    overlay.style.display = "block";
    descriptionModal.style.display = "block";
  }

  function onSaveClick( event ) {
    overlay.style.display = "block";
    saveModal.style.display = "block";
  }

  /* Allows the user to press enter to tab from the title */
  function onHeaderKeyPress( event ) {

    if ( event.keyCode === 13 ) {
      event.preventDefault();
      article.focus();
    }
  }

  /* Allows the user to press enter to tab from the word count modal */
  function onWordCountKeyUp( event ) {

    if ( event.keyCode === 13 ) {
      event.preventDefault();

      setWordCount( parseInt(this.value) );

      removeOverlay();

      article.focus();
    }
  }

  function onWordCountChange( event ) {

    setWordCount( parseInt(this.value) );
  }

  function setWordCount( count ) {

    // Set wordcount ui to active
    if ( count > 0) {

      wordCountValue = count;
      wordCounter.className = "word-counter active";
      updateWordCount();

    } else {

      wordCountValue = 0;
      wordCounter.className = "word-counter";
    }

    saveState();
  }

  function onArticleKeyUp( event ) {
      updateWordCount();
  }

  function updateWordCount() {

    var wordCount = editor.getWordCount(),
        word = wordCount === 1 ? "word" : "words";

    if ( wordCountValue > 0 ) {
      var percentageComplete = wordCount / wordCountValue;
      wordCounterProgress.style.height = percentageComplete * 100 + '%';
    }
    wordCountField.innerHTML = wordCount + " " + word;

    if ( percentageComplete >= 1 ) {
      wordCounterProgress.className = "progress complete";
    } else {
      wordCounterProgress.className = "progress";
    }
  }

  function selectFormat( e ) {

    if ( document.querySelectorAll('span.activesave').length > 0 ) {
      document.querySelector('span.activesave').className = '';
    }

    document.querySelector('.saveoverlay h1').style.cssText = '';

    var targ;
    if (!e) var e = window.event;
    if (e.target) targ = e.target;
    else if (e.srcElement) targ = e.srcElement;

    // defeat Safari bug
    if (targ.nodeType == 3) {
      targ = targ.parentNode;
    }

    targ.className ='activesave';

    saveFormat = targ.getAttribute('data-format');

    var header = document.querySelector('header.header');
    var headerText = header.innerHTML.replace(/(\r\n|\n|\r)/gm,"") + "\n";

    var body = document.querySelector('article.content');
    var bodyText = body.innerHTML;

    textToWrite = formatText(saveFormat,headerText,bodyText);

    var textArea = document.querySelector('.hiddentextbox');
    textArea.value = textToWrite;
    textArea.focus();
    textArea.select();

  }

  function formatText( type, header, body ) {

    var text;
    switch( type ) {

      case 'html':
        header = "<h1>" + header + "</h1>";
        text = header + body;
        text = text.replace(/\t/g, '');
      break;

      case 'markdown':
        header = header.replace(/\t/g, '');
        header = header.replace(/\n$/, '');
        header = "#" + header + "#";

        text = body.replace(/\t/g, '');

        text = text.replace(/<b>|<\/b>/g,"**")
          .replace(/\r\n+|\r+|\n+|\t+/ig,"")
          .replace(/<i>|<\/i>/g,"_")
          .replace(/<blockquote>/g,"> ")
          .replace(/<\/blockquote>/g,"")
          .replace(/<p>|<\/p>/gi,"\n")
          .replace(/<br>/g,"\n");

        var links = text.match(/<a href="(.+)">(.+)<\/a>/gi);

        for ( var i = 0; i<links.length; i++ ) {
          var tmpparent = document.createElement('div');
          tmpparent.innerHTML = links[i];

          var tmp = tmpparent.firstChild;

          var href = tmp.getAttribute('href');
          var linktext = tmp.textContent || tmp.innerText || "";

          text = text.replace(links[i],'['+linktext+']('+href+')');
        }

        text = header +"\n\n"+ text;
      break;

      case 'plain':
        header = header.replace(/\t/g, '');

        var tmp = document.createElement('div');
        tmp.innerHTML = body;
        text = tmp.textContent || tmp.innerText || "";

        text = text.replace(/\t/g, '')
          .replace(/\n{3}/g,"\n")
          .replace(/\n/,""); //replace the opening line break

        text = header + text;
      break;
      default:
      break;
    }

    return text;
  }

  return {
    init: init,
    updateWordCount: updateWordCount
  }

})();
