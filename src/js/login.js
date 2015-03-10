DixitViews.Login = View.extend({
  template: JST.login,

  afterRender: function() {

	$("#login-button", this.$el).click(function() {
    $(".waiting_spinner", this.$el).show();
    $(".login-form", this.$el).hide();
    DixitServer.login($("#login", this.$el).val(),
      function () {
        $(".waiting_spinner", this.$el).hide();
        $(".name-form", this.$el).show();
        console.log("Login successful");
        DixitServer.loginInfo(function(loginId, nickname) {
          $("#name", this.$el).html("Hello,</br><b>" + nickname + "</b>!");             
          },
          function(jqueryReq) {
            $(".login-form, .name-form, .waiting_spinner", this.$el).hide();
            $(".server_failed", this.$el).show();
          }
        );
      },
      function(jqueryReq) {
        $(".login-form, .name-form, .waiting_spinner", this.$el).hide();
        $(".server_failed", this.$el).show();
      }
    );
  });

	$("#logout-button", this.$el).click(function() {
		$(".waiting_spinner", this.$el).show();
    $(".name-form", this.$el).hide();
    DixitServer.logout(
			function() {
        $(".waiting_spinner", this.$el).hide();
				$(".login-form", this.$el).show();
				console.log("Log out successful");
			},
      function(jqueryResp) {
        $(".login-form, .name-form, .waiting_spinner", this.$el).hide();
 				$(".server_failed", this.$el).show();
			}
		);
	});

	$("#gotorooms-button", this.$el).click(function() {
		DixitRouter.navigateTo("Rooms");
	});	


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
    function(jqueryReq) {
      $(".login-form, .name-form, .waiting_spinner", this.$el).hide();
      $(".server_failed", this.$el).show();
    }
  );


  }
});
