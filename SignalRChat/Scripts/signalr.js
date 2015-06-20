    // Declare a proxy to reference the hub.
    var chat = $.connection.chatHub;
    // Create a function that the hub can call to broadcast messages.
    chat.client.broadcastMessage = function (name, message) {
        // Html encode display name and message.      
        var encodedName = $('<div />').text(name).html();
        var encodedMsg = $('<div />').text(message).html();
        // Add the message to the page.
        $('#discussion').prepend('<li><strong>' + encodedName
            + '</strong>:&nbsp;&nbsp;' + encodedMsg + '</li>');
    };
    chat.client.showUsersOnLine = function (keys, connection) {        
        var keysarray = keys.toString().split(',');
        var conarray = connection.toString().split(',');        
        var number = keysarray.indexOf($('#displayname').val());
        keysarray.splice(number, 1);
        conarray.splice(number, 1);        
        //trace('keys = ' + keysarray);
        //trace('users = ' + users);        
        if (keysarray[0] != null) {
            var audio = new Audio('/sound/bottle-open-1.mp3');
            audio.play();
            var i;
            $('#users').empty();
            for (i = 0; i < keysarray.length; i++) {
                var connectionId = conarray[i];
                //trace(connectionId);
                $('#users').append('<label><input type="radio" value= connectionId name="user" checked>' + keysarray[i] + '</label><br/>');
                $('input[name="user"]:checked').val(conarray[i]);
            }
            //var connectionId = $('input:radio[name ="user"]:checked', '#users').val();
            //trace('connectionId = ', + connectionId);
            //var conn = $('input[name="user"]:checked', '#users').val();
            //trace('conn = '+ conn);
        }
        else {
            $('#users').empty();
        }
    };

    chat.client.hangUpVideo = function () {
        hangup();
    };

    chat.client.sendOffer = function (desc) {                     
        trace('Offer sent ' + desc);
        answer(JSON.parse(desc));       
    };

    chat.client.sendIce = function (desc) {
        trace('Ice sent ' + desc);
        addIceCandidate(JSON.parse(desc));
    };

    chat.client.sendAnswer = function (desc) {
        trace('Answer sent ' + desc);
        getAnswer(JSON.parse(desc));        
    };    

// Get the user name and store it to prepend to messages.
    var name = prompt('Enter your name:', '');
    $('#displayname').val(name);
    //$('#myName').val(name);
    //trace('prompt ' + name);  
    // Set initial focus to message input box.
    $('#message').focus();
// Start the connection.
    $.connection.hub.qs = "userName=" + name;
    $.connection.hub.start().done(function () {       
        $('#sendmessage').click(function () {            
            // Call the Send method on the hub.
            chat.server.send($('#displayname').val(), $('#message').val());
            //var conn = $('input[name="user"]:checked', '#users').val();
            //trace('conn = ' + conn);
            //chat.server.sendToUser(conn, $('#displayname').val(), $('#message').val());
            // Clear text box and reset focus for next comment.
            $('#message').val('').focus();
        });       

        $('#message').keypress(function (e) {            
            if (e.which == 13) {//Enter key pressed
                $('#sendmessage').click();//Trigger search button click event
            }
        });        
        start(true);
    });
