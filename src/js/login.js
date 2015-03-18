DixitViews.Login = View.extend({
  template: JST.login,

  afterRender: function() {

	$("#login-button", this.$el).click(this.onLoginClick.bind(this));

	$("#logout-button", this.$el).click(this.onLogoutClick.bind(this));

	$("#gotorooms-button", this.$el).click(function() {DixitRouter.navigateTo("Rooms"); });	


	DixitServer.loginInfo(
    function(loginId, nickname) {
  		if (nickname != null) {
				$(".login-form, .waiting_spinner, .server_failed", this.$el).hide();
				$(".name-form", this.$el).show();
				$("#name", this.$el).html("Hello,<br/><b>" + nickname + "</b>!");		  				
  		}
  		else {
  			$(".login-form", this.$el).show();
				$(".name-form, .waiting_spinner, .server_failed", this.$el).hide();
  		};
    },
    this.ifServerFailed.bind(this)
  );
},


onLoginClick: function() {
  $(".waiting_spinner", this.$el).show();
  $(".login-form", this.$el).hide();
  DixitServer.login($("#login", this.$el).val(),
    this.ifLoginSuccess.bind(this),
    this.ifServerFailed.bind(this)
  );
},

onLogoutClick: function() {
  $(".waiting_spinner", this.$el).show();
  $(".name-form", this.$el).hide();
  DixitServer.logout(
    this.ifLogoutSuccess.bind(this),
    this.ifServerFailed.bind(this)
  );
},

ifServerFailed: function(jqueryReq) {
  $(".login-form, .name-form, .waiting_spinner", this.$el).hide();
  $(".server_failed", this.$el).show();
},

ifLoginSuccess: function(loginId, nickname) {
  $(".waiting_spinner", this.$el).hide();
  $(".name-form", this.$el).show();
  $("#name", this.$el).html("Hello,</br><b>" + nickname + "</b>!");
  console.log("Login successful");
},

ifLogoutSuccess: function() {
  $(".waiting_spinner", this.$el).hide();
  $(".login-form", this.$el).show();
  console.log("Log out successful");
}

});
