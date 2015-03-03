DixitViews.Login = View.extend({
  template: JST.login,

  afterRender: function() {
    $("#login-button", this.$el).click(function() {
      DixitRouter.navigateTo("Rooms");
    });
  }
});
