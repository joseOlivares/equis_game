var app = {
    serverUrl:'https://equisgame.herokuapp.com/',
    // Application Constructor
    initialize: function() {
        this.listenSocket();
    },

    listenSocket:function(){
        var socket = io.connect(this.serverUrl); //creating socket connection
        var userName=-1;
        socket.on('users connected', function(data){
            $('#usersConnected').html(data); //mostrando usuarios conectados
        }); 

        socket.on('users list',function(connectedUsers){

            for (var i = 0; i < connectedUsers.length; i++) {
                if(connectedUsers[i].userName!==userName){
                    $('#selectVersus').append($('<option>',{ value:connectedUsers[i].userName,text:connectedUsers[i].userName}));
                }
            }

        });

        socket.on('start game'){
               alert('Juego iniciado');
        };

        $('#btnLogin').on('click',function(){
                userName=$('#txtUserName').val();//Nombre de usuario

                if(userName==="" || userName.length <3){
                    UIkit.notification("<span class='uk-text-capitalize'>Escriba nombre de usuario</span>", {status: 'danger'});
                }else{
                    socket.emit('user loging',userName);
                    $('#txtUserName').prop('disabled', true); //Desabilitando el input
                    $('#btnLogin').prop('disabled',true);//disabling btnLogin
                    $('#btnLogout').prop('disabled',false); 
                    $('#selectVersus').prop('disabled',false);
                    $('#divVersus').prop('hidden',false);   //haciendo visible
                    $('#divLogin').addClass('uk-invisible');//ocultando login
                    $('#divMyUser').html(userName);                        
                }
        }); 

        $('#btnLogout').on('click',function(){      
                $('#txtUserName').prop('disabled', false); 
                $('#btnLogin').prop('disabled',false);
                $('#btnLogout').prop('disabled',true);
                $('#divVersus').prop('hidden',true);
                $('#divLogin').removeClass('uk-invisible');//mostrando login
        }); 

        $('#btnFight').on('click',function(){  
            var rival=$('#selectVersus').val() || "0";  
            if (rival!=="0"){ //se intenta configurar la pelea
                $('#btnFight').prop('disabled', true); 
                socket.emit('playwith',{rivalName:rival,contender:userName}); //enviando el nombre del rival con quien jugar                    
            }  

        });       

    }



};
app.initialize();
