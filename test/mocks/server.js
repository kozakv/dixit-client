DixitServerMock = {
  successfullLogin: function(request, nickname, loginid) {
    loginid = loginid || ("login-" + Math.round(Math.random() * 10000));
    request.respond(
      200,
      { "Content-Type": "application/json" },
      JSON.stringify({ id: loginid, nickname: nickname })
    );
  },

  successfullLoginInfo: function(request, nickname, loginid) {
    request.respond(
      200,
      { "Content-Type": "application/json" },
      JSON.stringify({ id: loginid, nickname: nickname })
    );
  },

  successfullLogout: function(request) {
    request.respond(
      204,
      { "Content-Type": "application/json" },
      ""
    );
  }
};
