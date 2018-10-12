var app = {
    serverUrl:'https://equisgame.herokuapp.com',
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


        $('#btnLogin').on('click',function(){
                userName=$('#txtUserName').val();//Nombre de usuario

                if(userName==="" || userName.length <3){
                    UIkit.notification("<span class='uk-text-capitalize'>Escriba nombre de usuario</span>", {status: 'danger'});
                }else{
                    socket.emit('user loging',userName);
                    $('#txtUserName').prop('disabled', true); //Desabilitando el input
                    $('#btnLogin').prop('disabled',true);//disabling btnLogin
                    $('#btnLogout').prop('disabled',false);                       
                }


                /*$('#idsender').prop('disabled', true); //disaabling input idsender
                $('#m').prop('disabled', false); //enabling input idsender
                socket.emit('user logged',currentUserId); //enviando ID de usurio logead    
                toReceivers(currentUserId);//adding posible receiver to html select, calling a function 
                $('#btnLogin').prop('disabled',true);//disabling btnLogin
                $('#btnLogout').prop('disabled',false);//enabling btnLogout
                */
        }); 

        $('#btnLogout').on('click',function(){      
                $('#txtUserName').prop('disabled', false); 
                $('#btnLogin').prop('disabled',false);
                $('#btnLogout').prop('disabled',true);
        }); 

    },



};
