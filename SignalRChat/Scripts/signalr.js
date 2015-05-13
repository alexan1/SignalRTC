//$(function () {
    // Declare a proxy to reference the hub.
    var chat = $.connection.chatHub;
    // Create a function that the hub can call to broadcast messages.
    chat.client.broadcastMessage = function (name, message) {
        // Html encode display name and message.
        //trace('Message');
        var encodedName = $('<div />').text(name).html();
        var encodedMsg = $('<div />').text(message).html();
        // Add the message to the page.
        $('#discussion').append('<li><strong>' + encodedName
            + '</strong>:&nbsp;&nbsp;' + encodedMsg + '</li>');
    };

    chat.client.sendOffer = function () {
        trace('Connection1');
        var pc1 = new RTCPeerConnection();
        trace('localStream');
        pc1.onicecandidate = function (e) {
            onIceCandidate(pc1, e);
        };
        pc1.addStream(localStream);
        pc1.createOffer(function (desc) {
            pc1.setLocalDescription(desc, function () {
                chat.server.send(JSON.stringify({ "sdp": desc }));
                trace('Offer sent 2 ' + JSON.stringify({ "sdp": desc }));
                //connection.onaddstream = gotRemoteStream;
                //attachMediaStream(remoteVideo, localStream);
            });
        });


    };
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
            chat.server.offer();
            trace('Offer sent');
        });

    });
//});

//function SendOffer() {

//    var connection = new RTCPeerConnection();
//    //connection.addStream(stream);
//    connection.createOffer(function (desc) {
//        connection.setLocalDescription(desc, function () {
//            chat.server.send(JSON.stringify({ "sdp": desc }));
//        });
//    });
//}