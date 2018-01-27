// YOUR CODE HERE:
// url is http://parse.hrr.hackreactor.com/chatterbox/classes/messages

// example is message = {
//   username: "username",
//   text: "text",
//   roomname: "roomname"
// }
$(document).ready(function() {

  var userName = window.location.search.split("name=")[1];
  var currentRoom = $('#roomSelect').val();

  var friendList = {};

  var app = {
    server: "http://parse.hrr.hackreactor.com/chatterbox/classes/messages?order=-createdAt",
    init: function(){
      $('#send').on('click', function(event) {
        var message = {
          username: userName,
          text: $('#message').val(),
          roomname: currentRoom
        };
        $('#message').val('');
        app.handleSubmit(message);
        event.preventDefault();
      });
      $("#main").on('click', '.username', function(event) {
        var user = $(this).text().split(':')[0];
        app.handleUsernameClick(user);
        app.fetch();
        event.preventDefault();
      });

      $('#create').find('.createroom').on('click', function(event) {
        event.preventDefault();
        var newRoomName = $('.roomname').val();
        $('.roomname').val('');
        var newRoom = $('<option value="' + newRoomName + '">' +
              newRoomName + '</option>');
        $('#roomSelect').append(newRoom);
        $('#roomSelect').val(newRoomName);
        currentRoom = newRoom.val();
      });

      $('#roomSelect').change(function(event) {
        event.preventDefault();
        currentRoom = $('#roomSelect').val();
        app.fetch();
      });

      setInterval(function() { app.fetch() }, 1000);

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
        success: function(data) {
          console.log('sent');
          app.fetch();
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
      if (message.roomname === currentRoom) {
        if (message.username !== null && message.text !== null) {
          var container = $("<div class='chat'></div>");
          var user = $("<div class='username'>" + _.escape(message.username) + ": </div>");
          var text = $("<div class='message'>" + _.escape(message.text) + "</div>");
          if (friendList[message.username]) {
            text = $("<div class='message'><b>" + _.escape(message.text) + "</b></div>");
          }
          container.append(user);
          container.append(text);
          $("#chats").append(container);
        }
      }
    },
    handleUsernameClick: function(user) {
      if (!friendList[user]) {
        friendList[user] = true;
      } else {
        friendList[user] = !friendList[user];
      }
    },
    handleSubmit: function(message){
      app.send(message);
    }
  };
  app.init();
});
