/*
 *  Copyright (c) 2014 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';
//$.getScript("/signalr/hubs");

function successCallback(stream) {

    var video = document.getElementById('localVideo');
    attachMediaStream(video, stream);


    //SendOffer(stream);
    //var remotevideo = document.getElementById('remoteVideo');
    //attachMediaStream(remotevideo, stream);

    //var pc = new RTCPeerConnection();
    //pc.addStream(stream);

    //pc.createOffer(gotDescription);
    

}

function errorCallback(error) {
    console.log('navigator.getUserMedia error: ', error);
}

function AddVideo() {

    var constraints = {
        audio: true,
        video: true
    };

    getUserMedia(constraints, successCallback, errorCallback);

    //pc1 = new RTCPeerConnection(null);
    //pc1.addStream(stream);
    //pc1.createOffer(gotDescription1);

    //pc2 = new RTCPeerConnection(servers);
    //pc2.onaddstream = gotRemoteStream;


    //send stream to remote
    //var connection = new RTCPeerConnection(null);
    //connection.addStream(stream);
    //connection.createOffer(function (desc) {

    //    connection.setLocalDescription(desc, function () {

    //        chatHub.server.send(JSON.stringify({ "sdp": desc }));

    //    });
    //});

    //connection.onicecandidate = function (event) {

    //    if (event.candidate) {

    //        chatHub.server.send(JSON.stringify({ "candiadate": event.candiadate }));
    //    }
    //}

}

//function SendOffer(stream) {
   
//    var connection = new RTCPeerConnection();    
//    connection.addStream(stream);
//    connection.createOffer(function (desc) {
//        connection.setLocalDescription(desc, function () {
//            chat.server.send(JSON.stringify({ "sdp": desc }));
//        });
//    });    
//}



    function gotDescription(desc) {
        pc.setLocalDescription(desc);
        //trace("Offer from pc1 \n" + desc.sdp);
        //pc.setRemoteDescription(desc);
        //pc.createAnswer(gotDescription2);
    };

    function gotRemoteStream(e) {
        vid2.src = URL.createObjectURL(e.stream);
    };

