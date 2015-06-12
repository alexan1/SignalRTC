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
    chat.client.showUsersOnLine = function (data) {
        //$('#users').val(data);
        var dates = data.toString().replace(",", "<br />");
        trace('showUsersOnLine ' + data.toString());
        $('#users').html('<li><strong>Online users: </strong></li>' + dates);
    };

    //chat.client.showUsers = function (user) {
    //    trace(user);
    //    $('#users').append('<li><strong>' + $('#displayname').val()
    //        + '</strong></li>');
    //};

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
        //connection.setRemoteDescription(new RTCSessionDescription(JSON.parse(desc).sdp));
    };    

// Get the user name and store it to prepend to messages.
    var name = prompt('Enter your name:', '');
    $('#displayname').val(name);
    trace('prompt ' + name);
    //chat.server.connect(name);
//this.username = name;
    //$.connection.u
    //connection.qs = { 'username': 'anik' };
//Context.User.Identity.Name
    //'<%HttpContext.Current.User.Identity.Name %>' = name;
    //System.Web.HttpContext.Current.User.Identity.Name = name;
    // Set initial focus to message input box.
    $('#message').focus();
// Start the connection.
//var usr = $.connection.usersOnLine;
    $.connection.hub.qs = "userName=" + name;
    $.connection.hub.start().done(function () {
        trace('hub ' + name);
        //chat.server.connect(name);
        $('#sendmessage').click(function () {            
            // Call the Send method on the hub.
            chat.server.send($('#displayname').val(), $('#message').val());            
            // Clear text box and reset focus for next comment.
            $('#message').val('').focus();
        });

        //chat.server.allUsers($('#displayname').val());

        $('#message').keypress(function (e) {            
            if (e.which == 13) {//Enter key pressed
                $('#sendmessage').click();//Trigger search button click event
            }
        });
        //remoteVideo.hidden = true;
        start();
    });
