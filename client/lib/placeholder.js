Placeholder = function (options) {
  'use strict';

    var settings = {
      element: null,
      placeholder: null,
      text: 'This is the first placeholder',
      placeholderClass: 'Placeholder',
      tags: {
        paragraph: 'p',
      }
    }

    var utils = {
      events: {
        addEvent: function addEvent(element, eventName, func) {
            if (element.addEventListener) {
                element.addEventListener(eventName, func, false);
            } else if (element.attachEvent) {
                element.attachEvent("on" + eventName, func);
            }
        },
        removeEvent: function addEvent(element, eventName, func) {
            if (element.addEventListener) {
                element.removeEventListener(eventName, func, false);
            } else if (element.attachEvent) {
                element.detachEvent("on" + eventName, func);
            }
        },
        preventDefaultEvent: function (e) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        }
      },
      keys: {
        up: function (e) {
          var innerText = utils.html.text(settings.element);
          if(innerText === '') {
            console.log('should add the placeholder now')
            utils.html.addPlaceholder();
          }
          else {
            console.log('should not add the a placeholder')
            utils.html.deleteNode(settings.placeholder);
          }
        }
      },
      html: {
        text: function(node, val){
          node = node || settings.element;
            if ((node.textContent) && (typeof (node.textContent) != "undefined")) {
              node.textContent = val;
            }
            else {
              node.innerText = val;
            }
            var vent = (node.textContent || node.innerText).trim();
            return '';
        },
        firstChild: function () {
          return settings.element.firstChild;
        },
        addTag: function (tag, el)  {
          var element = document.createElement(tag);
          el.appendChild(element);
        },
        addPlaceholder: function (tag, afterElement) {
          settings.placeholder = document.createElement(settings.tags.paragraph);
          settings.placeholder.innerHTML = settings.text;
          settings.placeholder.className += ' Placeholder';//settings.placeholderClass;
          settings.placeholder.setAttribute('contenteditable', false);

          settings.element.appendChild(settings.placeholder);
        },
        deleteNode: function(el){
          if(el === null) return;

          console.log('delete node', settings.placeholder);
          el.parentNode.removeChild(el);
        }
      }
    }

    var init = function (options) {
      // store element and add a p element
      settings.element = document.getElementById(options.element);
      settings.element.className += ' Placehold';
      utils.html.addTag(settings.tags.paragraph, settings.element);

      utils.keys.up.call(this);
      utils.events.addEvent(settings.element, 'keyup', utils.keys.up);
    }

    init(options);

}
