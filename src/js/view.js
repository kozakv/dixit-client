/**
 * Base class for Views-Controllers. These classes are responsible for logic implementation for related templates.
 *
 * Example:
 *
 *     DixitViews.Login = View.extend({
 *         template: JST.login,
 *
 *         afterRender: function() {
 *             console.log("Login rendered");
 *         }
 *     });
 *
 * @class View
 */
function View() {}

View.extend = extend;

View.prototype = {
  /**
   * Templated used with current view. This is the only mandatory field.
   *
   * @attribute template
   * @type {Function}
   */
  template: null,

  /**
   * JQuery dom element used to reference rendered view. Available after
   * {{crossLink "View/render:method"}}{{/crossLink}} call.
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
   * Actually create view. Do not reload this yet.
   *
   * @method render
   */
  render: function() {
    this.$el = $(this.template(this.serializeData()));

    this.afterRender();
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
   */
  close: function() {}
};

var DixitViews = {};
