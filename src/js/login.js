DixitViews.Login = View.extend({
  template: JST.login,

  afterRender: function() {
    /*$("#login-button", this.$el).click(function() {
      DixitRouter.navigateTo("Rooms");
	});
*/
	$("#login-button", this.$el).click(function() {
    $(".block_page, .waiting_spinner", this.$el).show();
    DixitServer.login($("#login", this.$el).val(),
      function () {
        $(".block_page, .waiting_spinner", this.$el).hide();
        $(".login-form", this.$el).hide();
        $(".name-form", this.$el).show();
        DixitServer.loginInfo(function(loginId, nickname) {
          $("#name", this.$el).html("Hello, " + nickname + "!");             
          },
          function(jqueryReq) {
            console.log("Failed to call server!");
          }
        );
      },
      function(jqueryReq) {
        console.log("Failed to call server!");
      }
    );
  });

	$("#logout-button", this.$el).click(function() {
		$(".block_page, .waiting_spinner", this.$el).show();
    DixitServer.logout(
			function() {
        $(".block_page, .waiting_spinner", this.$el).hide();
				$(".login-form", this.$el).show();
				$(".name-form", this.$el).hide();
				console.log("Log out successful");
			},
      function(jqueryResp) {
 				console.log("Server call failed");
			}
		);
	});

	$("#gotorooms-button", this.$el).click(function() {
		DixitRouter.navigateTo("Rooms");
	});	


	DixitServer.loginInfo(
    function(loginId, nickname) {
  		if (nickname != null) {
				$(".login-form", this.$el).hide();
				$(".name-form", this.$el).show();
				$("#name", this.$el).html("Hello, " + nickname + "!");		  				
  		}
  		else {
  			$(".login-form", this.$el).show();
				$(".name-form", this.$el).hide();
  		};
    },
    function(jqueryReq) {
      console.log("Failed to call server!");
    }
  );


  }
});
