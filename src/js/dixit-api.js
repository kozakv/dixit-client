var DixitServer = {
  loginId: null,
  nickname: null,
  rooms: [],

  loginInfo: function(successCb, failCb) {
    return this._get(
      "player",
      function(resp) {
        if(resp.status == 204) {
          this.loginId = null;
          this.nickname = null;
          if(successCb) successCb(this.loginId, this.nickname);
        } else if(resp.status == 200) {
          this.loginId = resp.responseJSON.id;
          this.nickname = resp.responseJSON.nickname;
          if(successCb) successCb(this.loginId, this.nickname);
        } else if(failCb) failCb(resp);
      }
    );
  },

  logout: function(successCb, failCb) {
    return this._post(
      "player/logout", {},
      function(resp) {
        if(resp.status == 204) {
          this.loginId = null;
          this.nickname = null;
          if(successCb) successCb();
        } else if(failCb) failCb(resp);
      }
    );
  },

  login: function(nickname, successCb, failCb) {
    return this._post(
      "player/login",
      { nickname: nickname },
      function(resp) {
        if(resp.status == 200) {
          this.loginId = resp.responseJSON.id;
          this.nickname = nickname;
          if(successCb) successCb(this.loginId, this.nickname);
        } else if(failCb) failCb(resp);
      }.bind(this)
    );
  },

  listRooms: function(successCb, failCb) {
    return this._get(
      "room/list",
      function(resp) {
        if(resp.status == 200) {
          this.rooms = resp.responseJSON;
          if(successCb) successCb(this.rooms);
        } else {
          this.rooms = [];
          if(failCb) failCb(resp);
        }
      }.bind(this)
    );
  },

  _get: function(path, callback) {
    return $.ajax({
      url: "rest/" + path,
      type: "GET",
      complete: callback,
      contentType: "application/json",
      dataType: "json"
    });
  },

  _post: function(path, data, callback) {
    return $.ajax({
      url: "rest/" + path,
      data: JSON.stringify(data),
      type: "POST",
      complete: callback,
      contentType: "application/json",
      dataType: "json"
    });
  }
};
