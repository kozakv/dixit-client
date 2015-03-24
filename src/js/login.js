DixitViews.Login = View.extend({
  template: JST.login,

  events: {
    "click #login-button": "onLoginClick",
    "click #logout-button": "onLogoutClick",
    "click #gotorooms-button": "navigateToRooms"
  },

  ui: {
    allLoginForms: ".login_forms",
    loginForm: "#login-form",
    loggedForm: "#logged-form",
    waitingSpinner: "#waiting-spinner",
    serverFailed: "#server-failed",
    userName: "#user-name",
    loginInput: "#login"
  },

afterRender: function() {
  DixitServer.loginInfo(
    this.ifLogged.bind(this),
    this.ifServerFailed.bind(this)
  );
},

ifLogged: function(loginId, nickname) {
  if (nickname != null) {
      this.ui.userName.html("Hello,<br/><b>" + nickname + "</b>!");
      this.ui.waitingSpinner.hide();
      this.ui.loggedForm.show();
   } else {
      this.ui.waitingSpinner.hide();
      this.ui.loginForm.show();
  };
},

onLoginClick: function() {
  this.ui.waitingSpinner.show();
  this.ui.loginForm.hide();
  DixitServer.login(
    this.ui.loginInput.val(),
    this.ifLoginSuccess.bind(this),
    this.ifServerFailed.bind(this)
  );
},

onLogoutClick: function() {
  this.ui.waitingSpinner.show();
  this.ui.loggedForm.hide();
  DixitServer.logout(
    this.ifLogoutSuccess.bind(this),
    this.ifServerFailed.bind(this)
  );
},

ifServerFailed: function(jqueryReq) {
  this.ui.allLoginForms.hide();
  this.ui.serverFailed.show();
},

ifLoginSuccess: function(loginId, nickname) {
  this.ui.waitingSpinner.hide();
  this.ui.loggedForm.show();
  this.ui.userName.html("Hello,</br><b>" + nickname + "</b>!");
  console.log("Login successful with " + nickname);
},

ifLogoutSuccess: function() {
  this.ui.waitingSpinner.hide();
  this.ui.loginForm.show();
  console.log("Log out successful");
},

navigateToRooms: function() {
  DixitRouter.navigateTo("Rooms");
}

});
