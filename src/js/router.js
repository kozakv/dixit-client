/**
 * Singletone used to manipulate current application view. Use it's
 * {{crossLink "DixitRouter/navigateto:method"}}{{/crossLink}} to switch between <code>Views</code>. Remember,
 * previousely used views will be closed with {{crossLink "View/close:method"}}{{/crossLink}}. You can overload it in
 * your views to do clean up tasks.
 *
 * @class DixitRouter
 */
var DixitRouter = {
  currentView: null,

  init: function() {
    var mainView = JST.main({ version: VERSION });
    this.$main = $(mainView);
    this.$content = $("#content", this.$main);
    $(document.body).append(this.$main);

    this.navigateTo("Login");
  },

  /**
   * Change application views.
   *
   * @method navigateTo
   * @param {String} page name of class in DixitViews hash,
   * @param {Object} params passed to initialize view.
   */
  navigateTo: function(page, params) {
    if(this.currentView) {
      try {
        this.currentView.close();
      } catch(e) {
        console.error("could not destroy current view");
        console.error(e);
      }
    }
    this.$content.empty();
    this.currentView = new DixitViews[page](params);
    this.currentView.render();
    this.$content.append(this.currentView.$el);
  }
};
