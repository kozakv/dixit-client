// Successful room join:
// {"players":[{"nickname":"bot-0","id":"player-8","score":0},{"nickname":"bot-2","id":"player-7","score":0},{"nickname":"dima","id":"player-5","score":0},{"nickname":"bot-1","id":"player-6","score":0}],"deckTitle":"default","creator":{"nickname":"bot-0","id":"player-8","score":0},"isNew":false,"isFinished":false,"title":"room-bybot-0-2159","state":"MOTTO","id":"room-5"}

// Successful full description of room:
// {"players":[{"nickname":"bot-0","id":"player-8","score":0},{"nickname":"bot-2","id":"player-7","score":0},{"nickname":"dima","id":"player-5","score":0},{"nickname":"bot-1","id":"player-6","score":0}],"turnOwner":"player-8","ownHand":[{"id":"14","image":"14"},{"id":"71","image":"71"},{"id":"65","image":"65"},{"id":"30","image":"30"},{"id":"43","image":"43"},{"id":"45","image":"45"}],"motto":" later mordecai red red","ownTableCard":null,"tableCardsCount":3,"ready":null,"publicTableCards":null,"tableCards":null,"guessedCards":null,"state":"CARDS","id":"room-5"}

// Successful put card:
// {"players":[{"nickname":"bot-0","id":"player-8","score":0},{"nickname":"bot-2","id":"player-7","score":0},{"nickname":"dima","id":"player-5","score":0},{"nickname":"bot-1","id":"player-6","score":0}],"turnOwner":"player-8","ownHand":[{"id":"14","image":"14"},{"id":"65","image":"65"},{"id":"30","image":"30"},{"id":"43","image":"43"},{"id":"45","image":"45"}],"motto":" later mordecai red red","ownTableCard":{"id":"71","image":"71"},"tableCardsCount":4,"ready":null,"publicTableCards":[{"id":"38","image":"38"},{"id":"13","image":"13"},{"id":"71","image":"71"},{"id":"62","image":"62"}],"tableCards":null,"guessedCards":null,"state":"VOTES","id":"room-5"}

// Make Guess response:
// {"players":[{"nickname":"bot-0","id":"player-8","score":0},{"nickname":"bot-2","id":"player-7","score":0},{"nickname":"dima","id":"player-5","score":2},{"nickname":"bot-1","id":"player-6","score":1}],"turnOwner":"player-8","ownHand":[{"id":"14","image":"14"},{"id":"65","image":"65"},{"id":"30","image":"30"},{"id":"43","image":"43"},{"id":"45","image":"45"},{"id":"18","image":"18"}],"motto":" later mordecai red red","ownTableCard":{"id":"71","image":"71"},"tableCardsCount":4,"ready":[],"publicTableCards":[{"id":"38","image":"38"},{"id":"13","image":"13"},{"id":"71","image":"71"},{"id":"62","image":"62"}],"tableCards":{"player-7":{"id":"38","image":"38"},"player-6":{"id":"13","image":"13"},"player-5":{"id":"71","image":"71"},"player-8":{"id":"62","image":"62"}},"guessedCards":{"player-7":{"id":"71","image":"71"},"player-6":{"id":"71","image":"71"},"player-5":{"id":"13","image":"13"}},"state":"RESULTS","id":"room-5"}

// Ready response:
// {"players":[{"nickname":"bot-0","id":"player-8","score":0},{"nickname":"bot-2","id":"player-7","score":0},{"nickname":"dima","id":"player-5","score":2},{"nickname":"bot-1","id":"player-6","score":1}],"turnOwner":"player-7","ownHand":[{"id":"14","image":"14"},{"id":"65","image":"65"},{"id":"30","image":"30"},{"id":"43","image":"43"},{"id":"45","image":"45"},{"id":"18","image":"18"}],"motto":null,"ownTableCard":null,"tableCardsCount":null,"ready":null,"publicTableCards":null,"tableCards":null,"guessedCards":null,"state":"MOTTO","id":"room-5"}

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
