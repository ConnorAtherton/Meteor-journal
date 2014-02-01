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
