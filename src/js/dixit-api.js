/**
 * Entry point for all interraction with dixit server. Uses server local to client.
 *
 * Most of commands work only when player is logged in. So start with calling <code>loginInfo</code> and
 * <code>login</code> methods.
 *
 * Rooms related functions require room id as first parameter. So keep it when you join room, or create one.
 *
 * During the game - you should periodically poll server with
 * {{#crossLink "DixitServer/roomFullInfo:method"}}{{/crossLink}} to know current game state. For example, when it is
 * <code>MOTTO</code>, you should check if you are <code>turnOwner</code>, and make propper
 * {{#crossLink "DixitServer/setMotto:method"}}{{/crossLink}} call to set motto of a round and put first card.
 *
 * You also should not forget to call {{#crossLink "DixitServer/ready:method"}}{{/crossLink}} on <code>RESULTS</code>
 * state of room to start play next round.
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
          this.nickname = resp.responseJSON.nickname;
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

  /**
   * Gets short information about some room. Use this method before game starts, to check if room is full.
   *
   * Example:
   *
   *     DixitServer.roomInfo(
   *         "room-777",
   *         function(info) {
   *             consonle.log(info.isNew ? "Room is not yet ready." : "Game is already started");
   *         },
   *         function(jqueryResp) {
   *         }
   *     );
   *
   * @method roomInfo
   * @static
   * @param {String} roomId id of room to describe,
   * @param {Function} successCb called when room info is available. it's only parameter is room description,
   * @param {Function} failCb called if something went wrong. it's only parameter is jquery response object.
   */
  roomInfo: function(roomId, successCb, failCb) {
    return this._get(
      "room/" + roomId,
      function(resp) {
        if(resp.status == 200) {
          if(successCb) successCb(resp.responseJSON);
        } else {
          this.rooms = [];
          if(failCb) failCb(resp);
        }
      }.bind(this)
    );
  },

  /**
   * Gets complete private vision of the game by currently logged in user. Use this method during the game to know what
   * is going on.
   *
   * Example:
   *
   *     DixitServer.roomFullInfo(
   *         "room-777",
   *         function(fullInfo) {
   *             consonle.log("Current game state: " + fullInfo.state);
   *         },
   *         function(jqueryResp) {
   *         }
   *     );
   *
   * @method roomFullInfo
   * @static
   * @param {String} roomId id of room to describe,
   * @param {Function} successCb called when room info is available. it's only parameter is room description,
   * @param {Function} failCb called if something went wrong. it's only parameter is jquery response object.
   */
  roomFullInfo: function(roomId, successCb, failCb) {
    return this._get(
      "room/" + roomId + "/full",
      function(resp) {
        if(resp.status == 200) {
          if(successCb) successCb(resp.responseJSON);
        } else {
          this.rooms = [];
          if(failCb) failCb(resp);
        }
      }.bind(this)
    );
  },

  /**
   * Creates room for user. Logged in user, who created the room, is automatically logged in. Very important attribute
   * is <code>id</code> - it is used in subsequant requests to identify subjects of all user's actions.
   *
   * Example:
   *
   *     DixitServer.createRoom(
   *         "The nice room title",
   *         function(info) {
   *             consonle.log("New room id is: " + info.id);
   *         },
   *         function(jqueryResp) {
   *         }
   *     );
   *
   * @method createRoom
   * @static
   * @param {String} title of the room to introduce it to other players,
   * @param {Function} successCb called when room is created. it's only parameter is short room description,
   * @param {Function} failCb called if something went wrong. it's only parameter is jquery response object.
   */
  createRoom: function(title, successCb, failCb) {
    return this._post(
      "room/create",
      {
        title: title
      },
      function(resp) {
        if(resp.status == 200) {
          if(successCb) successCb(resp.responseJSON);
        } else {
          if(failCb) failCb(resp);
        }
      }.bind(this)
    );
  },

  /**
   * Join already created room.
   *
   * Example:
   *
   *     DixitServer.joinRoom(
   *         "room-777"
   *         function(info) {
   *             consonle.log(info.isNew ? "Room is not full yet..." : "It's ok, we can start game.");
   *         },
   *         function(jqueryResp) {
   *         }
   *     );
   *
   * @method joinRoom
   * @static
   * @param {String} roomId to join,
   * @param {Function} successCb called when room is joined. it's only parameter is short room description,
   * @param {Function} failCb called if something went wrong. it's only parameter is jquery response object.
   */
  joinRoom: function(roomId, successCb, failCb) {
    return this._post(
      "room/" + roomId + "/join",
      {},
      function(resp) {
        if(resp.status == 200) {
          if(successCb) successCb(resp.responseJSON);
        } else {
          if(failCb) failCb(resp);
        }
      }.bind(this)
    );
  },

  /**
   * Quit room.
   *
   * Example:
   *
   *     DixitServer.joinRoom(
   *         "room-777"
   *         function() {
   *             console.log("Good bye !");
   *         },
   *         function(jqueryResp) {
   *         }
   *     );
   *
   * @method quitRoom
   * @static
   * @param {String} roomId to quit,
   * @param {Function} successCb called when room is quitted with no parameters,
   * @param {Function} failCb called if something went wrong. it's only parameter is jquery response object.
   */
  quitRoom: function(roomId, successCb, failCb) {
    return this._post(
      "room/" + roomId + "/quit",
      {},
      function(resp) {
        if(resp.status == 200) {
          if(successCb) successCb();
        } else {
          if(failCb) failCb(resp);
        }
      }.bind(this)
    );
  },

  /**
   * Set motto of some room. Use this method when you are turn owner, and game state is MOTTO.
   *
   * Example:
   *
   *     DixitServer.setMotto(
   *         "room-777", "The blueness of eyes", "card-123",
   *         function(fullInfo) {
   *             console.log("Check your motto: " + fullInfo.motto);
   *         },
   *         function(jqueryResp) {
   *         }
   *     );
   *
   * @method setMotto
   * @static
   * @param {String} roomId to set motto on,
   * @param {String} motto of the round,
   * @param {String} cardId to put along with set motto,
   * @param {Function} successCb called when motto is successfuly set. Only parameter is full room description,
   * @param {Function} failCb called if something went wrong. it's only parameter is jquery response object.
   */
  setMotto: function(roomId, motto, cardId, successCb, failCb) {
    return this._post(
      "room/" + roomId + "/set-motto",
      {
        motto: motto,
        cardId: cardId
      },
      function(resp) {
        if(resp.status == 200) {
          if(successCb) successCb(resp.responseJSON);
        } else {
          if(failCb) failCb(resp);
        }
      }.bind(this)
    );
  },

  /**
   * Put card when room state is CARDS.
   *
   * Example:
   *
   *     DixitServer.putCard(
   *         "room-777", "card-321",
   *         function(fullInfo) {
   *             console.log("Room state: " + fullInfo.state);
   *         },
   *         function(jqueryResp) {
   *         }
   *     );
   *
   * @method putCard
   * @static
   * @param {String} roomId to put card on,
   * @param {String} cardId to put along with set motto,
   * @param {Function} successCb called when card is successfuly put. Only parameter is full room description,
   * @param {Function} failCb called if something went wrong. it's only parameter is jquery response object.
   */
  putCard: function(roomId, cardId, successCb, failCb) {
    return this._post(
      "room/" + roomId + "/put-card",
      {
        cardId: cardId
      },
      function(resp) {
        if(resp.status == 200) {
          if(successCb) successCb(resp.responseJSON);
        } else {
          if(failCb) failCb(resp);
        }
      }.bind(this)
    );
  },

  /**
   * Make guess when room state is VOTES.
   *
   * Example:
   *
   *     DixitServer.makeGuess(
   *         "room-777", "card-213",
   *         function(fullInfo) {
   *             console.log("Room state: " + fullInfo.state);
   *         },
   *         function(jqueryResp) {
   *         }
   *     );
   *
   * @method makeGuess
   * @static
   * @param {String} roomId to guess card in,
   * @param {String} cardId card player think belongs to turn owner,
   * @param {Function} successCb called when card is successfuly voted. Only parameter is full room description,
   * @param {Function} failCb called if something went wrong. it's only parameter is jquery response object.
   */
  makeGuess: function(roomId, cardId, successCb, failCb) {
    return this._post(
      "room/" + roomId + "/guess-card",
      {
        cardId: cardId
      },
      function(resp) {
        if(resp.status == 200) {
          if(successCb) successCb(resp.responseJSON);
        } else {
          if(failCb) failCb(resp);
        }
      }.bind(this)
    );
  },

  /**
   * Signal room that player is ready to continue, when room's state is RESULTS.
   *
   * Example:
   *
   *     DixitServer.ready(
   *         "room-777",
   *         function(fullInfo) {
   *             console.log("Room state: " + fullInfo.state);
   *         },
   *         function(jqueryResp) {
   *         }
   *     );
   *
   * @method ready
   * @static
   * @param {String} roomId to continue,
   * @param {Function} successCb called when you are heard. Only parameter is full room description,
   * @param {Function} failCb called if something went wrong. it's only parameter is jquery response object.
   */
  ready: function(roomId, successCb, failCb) {
    return this._post(
      "room/" + roomId + "/ready",
      {},
      function(resp) {
        if(resp.status == 200) {
          if(successCb) successCb(resp.responseJSON);
        } else {
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
