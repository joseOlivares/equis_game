var app = {
    serverUrl:'https://equisgame.herokuapp.com/',
    myUserName:-1, //-1 es no definido
    players:-1, //inicializando -1 es nadie
    myMark:-1, //-1 es no definido
    // Application Constructor
    initialize: function() {
        this.listenSocket();
        this.prepareBoard(true, true); //prepareBoard(Does it put happy faces?, are the buttons disabled?)
        this.setPosition();
    },

    listenSocket:function(){
        //var socket = io.connect(this.serverUrl); //creating socket connection
        socket.on('users connected', function(data){
            $('#usersConnected').html(data); //mostrando usuarios conectados
        }); 

        socket.on('users list',function(connectedUsers){
            //var valores=connectedUsers;
            //debugger;
            $('#selectVersus').children('option:not(:first)').remove(); //limpiando todos los valores, menos el primero

            for (var i = 0; i < connectedUsers.length; i++) {
                if(connectedUsers[i].userName!==app.myUserName){
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
                    $('#btnFight').prop('disabled', true);  //desabilitamos boton
                } //si no acepta hacer, hacer algo     
        });

        socket.on('contender firstmove', function(data){ //data contiene los nombres y ids de los jugadores 
            //ocurre en lado del Contender
            alert(data.rivalName+' ha aceptado Jugar... ¡realiza el primer movimiento!');
            $("#selectVersus").val(data.rivalName.toString()); //mostramos el nombre del rival
            $("#selectVersus").prop('disabled',true);//desabilitamos el select
            app.prepareBoard(false,false); //habilitamos el tablero para que Contender seleccione una posicion.
            app.players=data; //guardamos los datos de los jugadores en memoria local del contender, es un Json
            app.myMark=data.contenderMark; //guardamos marca del Contender 
            //**************************
            //aqui esperamos hasta que el contender de clic en algun botón indicando su posición a elegir
            //se debe disparar app.setPosition();
            //*****************
        });

        socket.on('rival setplayers', function(data){ //data contiene los nombres y ids de los jugadores
            //Ocurre en el lado del Rival
            app.players=data; //guardamos los datos de los jugadores en memoria local del Rival 
            app.myMark=data.rivalMark;//guardamos marca del Rival     
        });   

        socket.on('playing', function(data){ //data
            app.prepareBoard(false,false);
            alert("¡Es tu turno!");
            //marcado el movimiento del jugador anterior en nuestro tablero
            $('#'+data.markedPosition.toString()).html('<span class="uk-text-large uk-text-bold">'+data.mark+'</span>');

        });                      

        $('#btnLogin').on('click',function(){
                var userName=$('#txtUserName').val()||-1;//Guardadndo Nombre de usuario
                app.myUserName=userName.trim();
                if(app.myUserName==="" || app.myUserName.length <3){
                    UIkit.notification("<span class='uk-text-capitalize'>Escriba nombre de usuario</span>", {status: 'danger'});
                    app.myUserName=-1;
                }else{
                    socket.emit('user loging',app.myUserName);
                    $('#txtUserName').prop('disabled', true); //Desabilitando el input
                    $('#btnLogin').prop('disabled',true);//disabling btnLogin
                    $('#btnLogout').prop('disabled',false); 
                    $('#selectVersus').prop('disabled',false);
                    $('#divVersus').prop('hidden',false);   //haciendo visible
                    $('#divLogin').addClass('uk-invisible');//ocultando login
                    $('#divMyUser').html(app.myUserName);                        
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
                socket.emit('play with',{rivalName:rival,contender:app.myUserName}); //enviando el nombre del rival a retar                    
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
        if(pos){
            var btnPosText=$('#'+pos.toString()).text();
            debugger;
            if(app.players!==-1){ //si estan los datos de los jugadores en memoria
                var nextPlayer={idNextPlayer:-1,markedPosition:-1,mark:app.myMark};
                debugger;
                if (btnPosText!=="X" && btnPosText!=="O" ) { //si no ha sido marcada la posicion
                    $('#'+pos.toString()).html('<span class="uk-text-large uk-text-bold">'+app.myMark+'</span>');//ponemos su marca
                    app.prepareBoard(false,true);//deshabilitamos todos los botones, para que el otro jugador elija
                    
                    nextPlayer.markedPosition=pos; //posicion a marcar en el tablero del segundo jugador
                    if (app.myUserName===app.players.rivalName) { //si quien movio es el rival
                        nextPlayer.idNextPlayer=app.players.idContender; //el proximo movimiento sera del contender
                    }else{
                        nextPlayer.idNextPlayer=app.players.idRival;//el proximo movimiento sera del rival
                    }

                    //enviamos posicion y id del siguiente jugador para que tambien se aplique la seleccion en su tablero
                    socket.emit('next player',nextPlayer); 
                }else{ //¿que pasa si intenta colocar en marca en espacio ocupado? 
                    alert("Esta posición ya fue seleccionada");
                } 

            }//si no, es que hay un error en el juego y no se tienen todos los datos de los jugadores
            //pendiente definir que hacer si hay un error
        }
    }

};

