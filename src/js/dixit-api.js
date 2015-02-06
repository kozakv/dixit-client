var DixitServer = {
  login: function(nickname) {
    return this._post("player/login", { nickname: nickname }, this.loginResult.bind(this));
  },

  loginResult: function(response) {
  },

  listRooms: function(callback) {
    return this._get("room/list", this.onListRooms.bind(this, callback));
  },

  onListRooms: function(callback, response) {
    callback(response.responseJSON);
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
