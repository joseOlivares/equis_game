var express= require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public')); //serving statics files like css, js, images

var port=process.env.PORT || 3000; //this is for heroku




// Define/initialize our global vars
//var connectedUsers = []; //array to store usernames and socket.id
//-------------------------------


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//io.set('origins','*:*');

io.on('connection', function(socket){

	socket.on('user loging',function(userName){
		
		/*connectedUsers.push({
			id : socket.id,
			userName : userName
		});*/

		//console.log('An user connected...'+userName.toString());
		//console.log(connectedUsers.toString());
		socketCount++;// Socket has connected, increase socket count
		io.sockets.emit('users connected', socketCount);    // Let all sockets know how many are connected
	});




	socket.on('chat message', function(msg){ //broadcasting msgs

	});//end socket.on 'chat message'
 

    socket.on('disconnect', function () {

        socketCount--; // Decrease the socket count on a disconnect	
        io.sockets.emit('users connected', socketCount);    // Let all sockets know how many are connected
        console.log('user disconnected');
    });

}); //close socket.on("connection")


http.listen(port, function(){
  console.log('listening on *:'+port);
});



