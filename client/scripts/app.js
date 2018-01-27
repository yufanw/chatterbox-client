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
  server: "http://parse.hrr.hackreactor.com/chatterbox/classes/messages?order=-createdAt",
  init: function(){
    $('#send').on('click', function(event) {
      var message = {
        username: userName,
        text: $('#message').val(),
        roomname: $('#roomSelect').val()
      };
      $('#message').val('');
      app.handleSubmit(message);
      event.preventDefault();
    });
    $('#chats').find('.username').on('click', app.handleUsernameClick);

    setInterval(app.fetch, 2000);

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
        data.results.forEach( result => app.renderMessage(result) );
      }
    });
  },
  send: function(message) {
    $.ajax ({
      url: "http://parse.hrr.hackreactor.com/chatterbox/classes/messages",
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function() {
        console.log('sent');
        console.log(message);
      },
      error: function() {
        console.log('error');
      }
    });
  },
  renderRoom: function(roomname) {
    var room = $('<option value="' + roomname + '">' + roomname + '</option>');
    $("#roomSelect").append(room);
  },
  renderMessage: function(message) {
    var container = $("<div class='chat'></div>");
    var user = $("<div class='username'>" + _.escape(message.username) + ": </div>");
    var text = $("<div class='message'>" + _.escape(message.text) + "</div>");
    container.append(user);
    container.append(text);
    $("#chats").append(container);
  },
  handleUsernameClick: function(event) {

  },
  handleSubmit: function(message){
    app.send(message);
  }
};


$(document).ready(function() {
  app.init();
});
