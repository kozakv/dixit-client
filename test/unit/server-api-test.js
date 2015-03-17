describe("Server API", function(){
  var assert = chai.assert;

  describe("login", function(){
    var server, loginId;
    var nickname = "dima";
    beforeEach(function() { server = sinon.fakeServer.create(); });
    afterEach(function() { server.restore(); });
    it("should login well", function(){
      var successCb = sinon.spy();
      var failCb = sinon.spy();
      DixitServer.login("dima", successCb, failCb);
      DixitServerMock.successfullLogin(server.requests[0], nickname);
      assert.ok(successCb.calledOnce, "Success callback should have been called");
      assert.notOk(failCb.called, "Fail callback should have not been called");
      assert.ok(DixitServer.nickname, "Nickname should be set");
      assert.ok(DixitServer.loginId, "Login id should be set");
      assert.equal(DixitServer.nickname, nickname, "Nickname should be as requested");
      loginId = DixitServer.loginId;
      assert.ok(successCb.calledWith(loginId, nickname),
                "Success callback should have been called with nickname and loginId");
    });

    it("should get back information about login", function() {
      var successCb = sinon.spy();
      var failCb = sinon.spy();
      DixitServer.loginInfo(successCb, failCb);
      DixitServerMock.successfullLoginInfo(server.requests[0], nickname, loginId);
      assert.ok(successCb.calledOnce, "Success callback should have been called");
      assert.notOk(failCb.called, "Fail callback should have not been called");
      assert.ok(successCb.calledWith(loginId, nickname),
                "Success callback should have been called with nickname and loginId");
      assert.equal(DixitServer.nickname, nickname, "Nickname should not change");
      assert.equal(DixitServer.loginId, loginId, "Login id should not change");
    });

    it("should propperly logout", function() {
      var successCb = sinon.spy();
      var failCb = sinon.spy();
      DixitServer.logout(successCb, failCb);
      DixitServerMock.successfullLogout(server.requests[0]);
      assert.ok(successCb.calledOnce, "Success callback should have been called");
      assert.notOk(failCb.called, "Fail callback should have not been called");
      assert.ok(DixitServer.nickname, "Nickname should be erased");
      assert.ok(DixitServer.loginId, "Login id should be esased");
    });
  });
});
