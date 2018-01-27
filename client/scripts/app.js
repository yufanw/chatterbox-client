// YOUR CODE HERE:
// url is http://parse.hrr.hackreactor.com/chatterbox/classes/messages

// example is message = {
//   username: "username",
//   text: "text",
//   roomname: "roomname"
// }
var userName = window.location.search.split("name=")[1];


var friendList = {};

var app = {
  server: "http://parse.hrr.hackreactor.com/chatterbox/classes/messages",
  init: function(){
    $('#messageForm').find('.submit').submit(app.handleSubmit());
    $('#chats').find('.username').on('click', app.handleUsernameClick);

    setInterval(function() { app.fetch() }, 2000);
  },
  clearMessages: function(){
    $("#chats").remove();
    $("#main").append("<div id='chats'></div>");
  },
  fetch: function(){
    $.ajax({
      url: app.server,
      type: "GET",
      dataType: "JSON",
      success: function(data) {
        app.clearMessages();
        data.results.forEach( result => app.renderMessage(result));
      }
    });
  },
  send: function(message){
    $.ajax({
      url: app.server,
      type: "POST",
      data: message, //stringify or not
      contentType: "application/json",
      success: function(message) {
        app.renderMessage(message)

      },
      error: function() {
        console.log("There was an error. ");
      }
    });
  },
  renderRoom: function(roomname){
    var room = $('<option value="' + roomname + '">' + roomname + '</option>');
    $("#roomSelect").append(room);
  },
  renderMessage: function(message){
    var container = $("<div class='chat'></div>");
    var user = $("<div class='username'>" + _.escape(message.username) + ": </div>");
    var text = $("<div class='message'>" + _.escape(message.text) + "</div>");
    container.append(user);
    container.append(text);
    $("#chats").append(container);
  },
  handleUsernameClick: function(event){

  },
  handleSubmit: function(){
    var message = {};
    message.username = userName;
    message.text = $('#message').val();
    $('#message').val('');
    message.roomname = $('#roomSelect').val();
    app.send(message);
  }
};


$(document).ready(function() {
  app.init();
});
