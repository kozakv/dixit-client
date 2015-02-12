/**
 * Entry point for all interraction with dixit server. Uses server local to client.
 *
 * Most of commands work only when player is logged in. So start with calling <code>loginInfo</code> and
 * <code>login</code> methods.
 *
 * @class DixitServer
 */
var DixitServer = {
  /**
   * Current session login id defined by server. if <code>null</code> user is not logged in.
   *
   * @property loginId
   * @type String
   * @default null
   * @static
   * @readOnly
   */
  loginId: null,
  /**
   * Current user's nickname in dixit game.
   *
   * @property nickname
   * @type String
   * @default null
   * @static
   * @readOnly
   */
  nickname: null,
  /**
   * List of currently open known list of rooms.
   *
   * @property rooms
   * @type Array
   * @default []
   * @static
   * @readOnly
   */
  rooms: [],

  /**
   * Load current login info about user. Success callback either gets propper login id and nickname, or
   * <code>null</code> for both in case if user is not logged in.
   *
   * Example of usage:
   *
   *     DixitServer.loginInfo(
   *         function(loginId, nickname) {
   *             // this is callback is called when call is successful
   *             console.log("Your name is: " + nickname + ");
   *             console.log("Your internal id is: " + loginId + ");
   *         },
   *         function(jqueryReq) {
   *             // this is is called when something went wrong on server
   *             console.log("Failed to call server!");
   *         }
   *     );
   *
   * @method loginInfo
   * @static
   * @param {Function} successCb called upon successful login with login id and nickname in order as parameters.
   * @param {Function} failCb called upon failed login with jquery error as sole parameter.
   */
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

  /**
   * Request login on server. Before calling this method, make sure you are not already logged in with
   * <code>loginInfo</code> method.
   *
   * Usage example:
   *
   *     DixitServer.login( "user's login",
   *         function(loginId, nickname) {
   *             // this is callback is called when login is successful
   *             console.log("Your name is: " + nickname + ");
   *             console.log("Your internal id is: " + loginId + ");
   *         },
   *         function(jqueryResp) {
   *             // this is called when something did not work on server
   *             console.log("Login Failed.");
   *         }
   *     );
   *
   * @method login
   * @static
   * @param {String} nickname which name does user wish to have,
   * @param {Function} successCb successful login callback. it's parameters are login id on server and nickname,
   * @param {Function} failCb failed callback. sole parameter is jquery response object.
   */
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

  /**
   * This will log user out of dixit server.
   *
   * Example:
   *
   *     DixitServer.logout(
   *         function() {
   *             console.log("Log out successful");
   *         },
   *         function(jqueryResp) {
   *             console.log("Server call failed");
   *         }
   *     );
   *
   * @method logout
   * @static
   * @param {Function} successCb called when user is logged out without errors. no parameters passed.
   * @param {Function} failCb called when something went wrong. sole parameter is jquery response.
   */
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

  /**
   * Gets currently open rooms from server.
   *
   * Example:
   *
   *     DixitServer.listRooms(
   *         function(roomsList) {
   *             consonle.log("There are " + roomList.lenght + " open rooms now");
   *         },
   *         function(jqueryResp) {
   *         }
   *     );
   *
   * @method listRooms
   * @static
   * @param {Function} successCb called when room list is available. it's only parameter is an array of all open rooms.
   * @param {Function} failCb called if something went wrong. it's only parameter is jquery response object.
   */
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
