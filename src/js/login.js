DixitViews.Login = View.extend({
  template: JST.login,

  afterRender: function() {
    /*$("#login-button", this.$el).click(function() {
      DixitRouter.navigateTo("Rooms");
	});
*/
	$("#login-button", this.$el).click(function() {
       					DixitServer.login($("#login", this.$el).val());
    					DixitServer.loginInfo(function(loginId, nickname) {
								$("#name", this.$el).html("Hello, " + nickname + "!");		  				
       						},
            				function(jqueryReq) {
                				console.log("Failed to call server!");
            				}
        				);
       					$(".login-form", this.$el).hide();
   						$(".name-form", this.$el).show();
    
       				});

	$("#logout-button", this.$el).click(function() {
						DixitServer.logout(
  							function() {
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
