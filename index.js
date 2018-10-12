var express= require('express');
var app = express();
var server=require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public')); //serving statics files like css, js, images
var port=process.env.PORT || 3000; //this is for heroku


// Define/initialize our global vars
 var socketCount=0;
 var connectedUsers = []; //array to store usernames and socket.id
//-------------------------------


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//io.set('origins','*:*');

io.on('connection', function(socket){
	socketCount+=1;// Socket has connected, increase socket count
	
	socket.on('user loging',function(userName){
		socketCount+=1;// Socket has connected, increase socket count
		io.sockets.emit('users connected', socketCount);    // Let all sockets know how many are connected
		
		connectedUsers.push({
			id : socket.id,
			userName : userName
		});

		console.log('An user connected... '+userName.toString());
		io.sockets.emit('users list', connectedUsers); // enviando listado de todos los usuarios conectados
	});




	socket.on('chat message', function(msg){ //broadcasting msgs

	});//end socket.on 'chat message'
 

    socket.on('disconnect', function () {
        socketCount-=1; // Decrease the socket count on a disconnect
        var userDisconnected="";
	    for(var i=0; i < connectedUsers.length; i++){  //deletng users desconnected   
	        if(connectedUsers[i].id === socket.id){
	        	userDisconnected=connectedUsers[i].userName;
	          connectedUsers.splice(i,1); 
	        }
	    }

        io.sockets.emit('Users connected', socketCount);    // Let all sockets know how many are connected
        console.log('User disconnected... '+userDisconnected);
    });

}); //close socket.on("connection")


server.listen(port, function(){
  console.log('Server listening on *:'+port);
});



