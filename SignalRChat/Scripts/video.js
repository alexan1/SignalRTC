'use strict';

    var callButton = document.getElementById('callButton');
    var hangupButton = document.getElementById('hangupButton');
    callButton.disabled = false;    
    callButton.onclick = call;
    hangupButton.onclick = function () {
        chat.server.hangUp();
    };
        
        //hangup;

    var startTime;
    var localVideo = document.getElementById('localVideo');
    var remoteVideo = document.getElementById('remoteVideo');

    var localStream;
    var connection;
    
    var sdpConstraints = {
        'mandatory': {
            'OfferToReceiveAudio': true,
            'OfferToReceiveVideo': true
        }
    };

    localVideo.addEventListener('loadedmetadata', function () {
        trace('Local video currentSrc: ' + this.currentSrc +
          ', videoWidth: ' + this.videoWidth +
          'px,  videoHeight: ' + this.videoHeight + 'px');
    });

    remoteVideo.addEventListener('loadedmetadata', function () {
        trace('Remote video currentSrc: ' + this.currentSrc +
          ', videoWidth: ' + this.videoWidth +
          'px,  videoHeight: ' + this.videoHeight + 'px');
    });

    remoteVideo.onresize = function () {
        trace('Remote video size changed to ' +
          remoteVideo.videoWidth + 'x' + remoteVideo.videoHeight);
        // We'll use the first onsize callback as an indication that video has started playing out.
        if (startTime) {
            var elapsedTime = window.performance.now() - startTime;
            trace('Setup time: ' + elapsedTime.toFixed(3) + 'ms');
            startTime = null;
        }
    };   

function start(media) {
    remoteVideo.hidden = true;
    callButton.disabled = false;
    hangupButton.disabled = true;
    // Call into getUserMedia via the polyfill (adapter.js).
    if (media) {
        getUserMedia({ audio: true, video: true },
        gotStream, errorWebCam);
    }
    var servers = { 'iceServers': [{ 'urls': 'stun:74.125.142.127:19302' }] };
    //var  _iceServers = [{ url: 'stun:74.125.142.127:19302' }], // stun.l.google.com - Firefox does not support DNS names.
    connection = new RTCPeerConnection(servers); 
    trace('Created connection object');
    //var conn = $('input[name="user"]:checked', '#users').val();
    //trace('conn = ' + conn);
    connection.onicecandidate = function (e) {

        chat.server.iceCandidate(JSON.stringify({ "candidate": e.candidate }));
    };
    connection.onaddstream = function (e) {      
        // Call the polyfill wrapper to attach the media stream to this element.
        callButton.disabled = true;     
        attachMediaStream(remoteVideo, e.stream);
        trace('received remote stream');
  };     
}

function call() {
    var conn = $('input[name="user"]:checked').val();
    trace('conn1 = ' + conn);
    if (conn == "public") {
        alert("Sorry, you need to select user with whom you want to have video chat.");
        //hangup();
        return;
    }
    callButton.disabled = true;
    remoteVideo.hidden = false;    
  hangupButton.disabled = false;
  trace('Starting call');  
  startTime = window.performance.now();
  var videoTracks = localStream.getVideoTracks();
  var audioTracks = localStream.getAudioTracks();
  if (videoTracks.length > 0) {
    trace('Using video device: ' + videoTracks[0].label);
  }
  if (audioTracks.length > 0) {
    trace('Using audio device: ' + audioTracks[0].label);
  } 

  if (localStream != null) {
      connection.addStream(localStream);
      trace('Added local stream to connection');
  }

  trace('connection createOffer start');
  connection.createOffer(onCreateOfferSuccess, errorHandler, sdpConstraints);
}

function answer(message) {
    remoteVideo.hidden = false;
    hangupButton.disabled = false;
    trace('send answer ' + message.sdp);
    connection.setRemoteDescription(new RTCSessionDescription(message.sdp), function () {       
        trace('setRemoteDescription');
        if (localStream != null) {
            connection.addStream(localStream);
        }
            connection.createAnswer(function (desc) {
                connection.setLocalDescription(desc, function () {
                    chat.server.answer(JSON.stringify({ "sdp": desc}));
                }, errorHandler);                
            }, errorHandler);            
    }, errorHandler);    
}

function addIceCandidate(message) {
    if (message.candidate != null) {
        trace('add ice candidate');
        connection.addIceCandidate(new RTCIceCandidate(message.candidate));
    }
}

function getAnswer(message) {
    if (message.sdp != null) {
        trace('get answer');
        connection.setRemoteDescription(new RTCSessionDescription(message.sdp));
    }
}

function gotStream(stream) {
    trace('Received local stream');
    // Call the polyfill wrapper to attach the media stream to this element.
    attachMediaStream(localVideo, stream);
    localStream = stream;
    callButton.disabled = false;
}

function onCreateOfferSuccess(desc) {
    trace('Offer created'); 
    trace('setLocalDescription start');
    var conn = $('input[name="user"]:checked').val();
    trace('conn2 = ' + conn);
    if (conn == "public")
    {
        alert("Sorry, you need to select user with whom you want to have video chat.");
        hangup();
        return;
    }
  connection.setLocalDescription(desc, function () {
      chat.server.offer(conn, JSON.stringify({ "sdp": desc }));
    onSetLocalSuccess(connection);
  }, errorHandler);  
}

function onSetLocalSuccess(connection) {
  trace(' setLocalDescription complete');
}

function onSetRemoteSuccess(connection) {
  trace(' setRemoteDescription complete');
}

function onCreateAnswerSuccess(desc) {
    trace('Answer from pc2:\n' + desc.sdp);
    trace('pc1 setRemoteDescription start');    
  trace('pc2 setLocalDescription start');
  connection.setLocalDescription(desc, function () {
      onSetLocalSuccess(connection);
  }, errorHandler);}
 
  


function onAddIceCandidateSuccess(connection) {
  trace(' addIceCandidate success');
}

function onAddIceCandidateError(connection, error) {
  trace(' failed to add ICE Candidate: ' + error.toString());
}

var errorHandler = function (err) {
    console.error(err);
};

var errorWebCam = function (err) {
    console.error(err);
    alert('Sorry, WebCam is absent');
    callButton.disabled = true;
};

function hangup() {
  trace('Ending call');
  connection.close();  
  connection = null;
  remoteVideo.hidden = true;
  start(false);
  //hangupButton.disabled = true;
  //callButton.disabled = false;
  
}
