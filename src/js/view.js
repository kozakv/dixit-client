/**
 * Base class for Views-Controllers. These classes are responsible for logic implementation for related templates.
 *
 * Example:
 *
 *     DixitViews.Login = View.extend({
 *         template: JST.login,
 *
 *         tagName: "span",
 *         classNames: ["success", "label"],
 *
 *         afterRender: function() {
 *             console.log("Login rendered");
 *         }
 *     });
 *
 * Preferred way to access rendered elements is through {{#crossLink "View/$:method"}}{{/crossLink}} to ensure that all
 * the searches are performed in propper container element.
 *
 * @class View
 */
function View() {}

var delegateEventSplitter = /^(\S+)\s*(.*)$/;

View.extend = extend;

View.prototype = {
  /**
   * Templated used with current view. This is the only mandatory field.
   *
   * @attribute template
   * @type {Function}
   */
  template: function() { return ""; },

  /**
   * Container element tag name.
   *
   * @attribute tagName
   * @type {String}
   * @default "div"
   */
  tagName: "div",

  /**
   * Container element class names.
   *
   * @attribute classNames
   * @type {Array}
   * @default []
   */
  classNames: [],

  /**
   * JQuery dom element used to reference rendered view. Available after
   * {{#crossLink "View/render:method"}}{{/crossLink}} call.
   *
   * @attribute template
   * @type {Function}
   */
  $el: null,

  /**
   * Data for template to use while initial rendering. Override this to give some good data to template.
   *
   * @method serializeData
   * @returns {Object} parameters for initial render.
   */
  serializeData: function() { return null; },

  /**
   * Creates default container element with {{#crossLink "View/tagName:attribute"}}{{/crossLink}} and
   * {{#crossLink "View/classNames:attribute"}}{{/crossLink}}.
   *
   * @method createElement
   * @returns {Object} jQuery container object
   */
  createElement: function() {
    var el = $(document.createElement(this.tagName));
    el.attr({ "class": this.classNames });
    return el;
  },

  /**
   * Takes jQuery element as container and (in future) wires all the view-related events.
   *
   * @method setElement
   * @returns {Object} jQuery container object
   */
  setElement: function(el) {
    this.$el = (el instanceof $) ? el : $(el);
  },

  /**
   * Takes jQuery element as container and (in future) wires all the view-related events.
   *
   * @method $
   * @param {String} selector jQuery selector
   * @returns {Object} jQuery object found using selector in view's container
   */
  $: function(selector) { return this.$el.find(selector); },

  /**
   * Actually create view. Do not reload this yet.
   *
   * @method render
   */
  render: function() {
    this.setElement(this.createElement());
    this.$el.html($(this.template(this.serializeData())));
    this.delegateEvents();
    this.bindUI();
    this.afterRender();
  },

  delegateEvents: function(events) {
    if (!(events || (events = _.result(this, 'events')))) return this;
    for (var key in events) {
      var method = events[key];
      if (!_.isFunction(method)) method = this[events[key]];
      if (!method) continue;
      var match = key.match(delegateEventSplitter);
      this.delegate(match[1], match[2], _.bind(method, this));
      }
    return this;
    },

  delegate: function(eventName, selector, listener) {
    this.$el.on(eventName + '.delegateEvents', selector, listener);
    },

  bindUI: function(ui) {
    var obj = {};
    if (!(ui || (ui = _.result(this, 'ui')))) return this;
    for (var key in ui) {
      obj[key] = $(ui[key], this.$el);
    } 
    this.ui = obj;
return this;
},
  /**
   * Called when all required elements are rendered and ready to use. This is user-defined part of initialization of the
   * view.
   *
   * Use <code>this.$el</code> to search for elements of view:
   *
   *     $("#login-button", this.$el)
   *
   * will return element with <code>login-button</code> id of current view.
   *
   * @method afterRender
   */
  afterRender: function() {
  },

  /**
   * Called after view is no longer used. Should clean up useless handlers and links here.
   *
   * @method close
   */
  close: function() {
    this.$el = null;
  }
};

var DixitViews = {};
