function login() {
  $("#login-button").attr("disabled", true);
  DixitServer.login($("#login").val()).then(listRooms);
}

function listRooms() {
  DixitServer.listRooms(onRoomsResponse);
}

function onRoomsResponse(list) {
  console.log(list);
  $("#rooms").html(JST.roomlist({ rooms: list }));
}
