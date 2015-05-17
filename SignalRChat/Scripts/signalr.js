    // Declare a proxy to reference the hub.
    var chat = $.connection.chatHub;
    // Create a function that the hub can call to broadcast messages.
    chat.client.broadcastMessage = function (name, message) {
        // Html encode display name and message.      
        var encodedName = $('<div />').text(name).html();
        var encodedMsg = $('<div />').text(message).html();
        // Add the message to the page.
        $('#discussion').append('<li><strong>' + encodedName
            + '</strong>:&nbsp;&nbsp;' + encodedMsg + '</li>');
    };


    chat.client.sendOffer = function (desc) {                     
        trace('Offer sent ' + desc);

        connection.setRemoteDescription(new RTCSessionDescription(message.sdp), function () {
            if (connection.RemoteDescription.type == 'offer') {
                connection.addStream(localStream);
                connection.CreateAnswer(function (desc) {
                    connection.setLocalDescription(desc, function () {
                        chat.server.offer(JSON.stringify({ "sdp": connection.LocalDescription }));
                    });
                });
            }
        });

        chat.client.sendIce = function (desc) {
            trace('Ice sent ' + desc);
        };
        //connection.addStream(localStream);
        //connection.setRemoteDescription(new RTCSessionDescription(desc.sdp), function () {
        //    trace(' setRemoteDescription complete');
        //});
        //trace('Added local stream to connection');
        //trace('connection createAnswer start');       
        //connection.createAnswer(onCreateAnswerSuccess, onCreateSessionDescriptionError);
    };

    //chat.client.connect = function () {
    //    trace('connected');
    //};    

    // Get the user name and store it to prepend to messages.
    $('#displayname').val(prompt('Enter your name:', ''));
    start();
    // Set initial focus to message input box.
    $('#message').focus();
    // Start the connection.
    $.connection.hub.start().done(function () {
        $('#sendmessage').click(function () {
            // Call the Send method on the hub.
            chat.server.send($('#displayname').val(), $('#message').val());
            // Clear text box and reset focus for next comment.
            $('#message').val('').focus();
        });
        $('#sendoffer').click(function () {
            //chat.server.offer();            
            //trace('Offer sent');
            answer();
        });

    });
