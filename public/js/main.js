var app = {
    serverUrl:'https://equisgame.herokuapp.com/',
    players:[],
    // Application Constructor
    initialize: function() {
        this.listenSocket();
        this.prepareBoard(true, true); //prepareBoard(Does it put happy faces?, are the buttons disabled?)
    },

    listenSocket:function(){
        var socket = io.connect(this.serverUrl); //creating socket connection
        var userName=-1;
        socket.on('users connected', function(data){
            $('#usersConnected').html(data); //mostrando usuarios conectados
        }); 

        socket.on('users list',function(connectedUsers){
            //var valores=connectedUsers;
            //debugger;
            $('#selectVersus').children('option:not(:first)').remove(); //limpiando todos los valores, menos el primero

            for (var i = 0; i < connectedUsers.length; i++) {
                if(connectedUsers[i].userName!==userName){
                    $('#selectVersus').append($('<option>',{ value:connectedUsers[i].userName,text:connectedUsers[i].userName}));
                }
            }

        });

        socket.on('start game', function(data){ //data contiene los nombres de los jugadores
                var play=confirm(data.contender+' quiere jugar contigo...')||false;
                if(play==true){//si acepta jugar 
                    socket.emit('game started',data); //le indicamos al server que el juego inicio
                    $("#selectVersus").val(data.contender.toString()); //mostramos el nombre del contrincante
                    $("#selectVersus").prop('disabled',true);//desabilitamos el select
                } //si no acepta hacer, hacer algo     
        });

        socket.on('first move', function(data){ //data contiene los nombres y ids de los jugadores
            alert(data.rivalName+' ha aceptado Jugar... realiza el primer movimiento');
            $("#selectVersus").val(data.rivalName.toString()); //mostramos el nombre del rival
            $("#selectVersus").prop('disabled',true);//desabilitamos el select
            this.prepareBoard(false,false); //habilitamos el tablero para que seleccione una posicion.

        });        

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
                socket.emit('play with',{rivalName:rival,contender:userName}); //enviando el nombre del rival a retar                    
            }  

        });       

    },

    prepareBoard: function(happyFaces,areBtnDisabled){
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if(happyFaces==true){
                    $('#p'+i+j).html('<span class="uk-icon" uk-icon="icon: happy"></span>'); 
                }

                $('#p'+i+j).prop('disabled',areBtnDisabled); //it can be true or false
            }       
        }
    },

    setPosition: function(pos){
        alert(pos);
    }

};

