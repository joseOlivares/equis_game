var app = {
    serverUrl:'https://equisgame.herokuapp.com/',
    // Application Constructor
    initialize: function() {
        this.listenSocket();
    },

    listenSocket:function(){
         var socket = io.connect(this.serverUrl); //creating socket connection

        socket.on('users connected', function(data){
            $('#usersConnected').html(data); //displaying how many connections are.
        }); 
    
    }

};
