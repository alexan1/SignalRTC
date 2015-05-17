'use strict';

    var callButton = document.getElementById('callButton');
    var hangupButton = document.getElementById('hangupButton');
    callButton.disabled = false;
    hangupButton.disabled = true;    
    callButton.onclick = call;
    hangupButton.onclick = hangup;

    var startTime;
    var localVideo = document.getElementById('localVideo');
    var remoteVideo = document.getElementById('remoteVideo');

    var localStream;
    var connection;
    
    var sdpConstraints = {
        'mandatory': {
            'OfferToReceiveAudio': false,
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

function gotStream(stream) {
  trace('Received local stream');
  // Call the polyfill wrapper to attach the media stream to this element.
  attachMediaStream(localVideo, stream);
  localStream = stream;
  callButton.disabled = false;
}

function start() {
  trace('Requesting local stream');  
  // Call into getUserMedia via the polyfill (adapter.js).
  getUserMedia({
      audio: true,
      video: true
    }, gotStream,
    function(e) {
      alert('getUserMedia() error: ' + e.name);
    });
  var servers = null;
  connection = new RTCPeerConnection(servers);
  trace('Created local peer connection object');  
  connection.onicecandidate = function (e) {      
      chat.server.iceCandidate(JSON.stringify({ "candidate": e.candidate }));
  };
  connection.onaddstream = function (e) {
      trace('gotRemoteStream');
      // Call the polyfill wrapper to attach the media stream to this element.
      attachMediaStream(remoteVideo, e.stream);
      trace('pc2 received remote stream');
  };

      //gotRemoteStream;
}

function call() {
  callButton.disabled = true;
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

  connection.addStream(localStream);
  trace('Added local stream to connection');

  trace('connection createOffer start');
  connection.createOffer(onCreateOfferSuccess, onCreateSessionDescriptionError);
}

function answer() {
    trace('give answer');
    //connection.setRemoteDescription(new RTCSessionDescription(message.sdp), function () {
    //    if (connection.RemoteDescription.type == 'offer') {
    //        connection.addStream(localStream);
    //        connection.CreateAnswer(function (desc) {
    //            connection.setLocalDescription(desc, function () {
    //                chat.server.offer(JSON.stringify({ "sdp": connection.LocalDescription }));
    //            });
    //        });
    //    }
    //});
    connection.addStream(localStream);
    trace('Added local stream to connection');
    trace('connection createAnswer start');
    //connection.setRemotelDescription
    //connection.setRemoteDescription(desc, function () {
    //    onSetRemoteSuccess(connection);
    //});
    connection.createAnswer(onCreateAnswerSuccess, onCreateSessionDescriptionError);
}


function onCreateSessionDescriptionError(error) {
  trace('Failed to create session description: ' + error.toString());
}

function onCreateOfferSuccess(desc) {
    trace('Offer from pc1\n'); //desc.sdp);
  trace('pc1 setLocalDescription start');
  connection.setLocalDescription(desc, function () {
    chat.server.offer(JSON.stringify({ "sdp": desc }));
    onSetLocalSuccess(connection);
  }); 
}

function onSetLocalSuccess(connection) {
  trace(' setLocalDescription complete');
}

function onSetRemoteSuccess(connection) {
  trace(' setRemoteDescription complete');
}

function gotRemoteStream(e) {
    trace('gotRemoteStream');
  // Call the polyfill wrapper to attach the media stream to this element.
  attachMediaStream(remoteVideo, e.stream);
  trace('pc2 received remote stream');
}

function onCreateAnswerSuccess(desc) {
    trace('Answer from pc2:\n' + desc.sdp);
    trace('pc1 setRemoteDescription start');
    //connection.setRemoteDescription(desc, function () {
    //    onSetRemoteSuccess(connection);
    //});
  trace('pc2 setLocalDescription start');
  connection.setLocalDescription(desc, function () {
      onSetLocalSuccess(connection);
  });
  
}

function onAddIceCandidateSuccess(connection) {
  trace(' addIceCandidate success');
}

function onAddIceCandidateError(connection, error) {
  trace(' failed to add ICE Candidate: ' + error.toString());
}


function hangup() {
  trace('Ending call');
  connection.close();  
  connection = null;  
  hangupButton.disabled = true;
  callButton.disabled = false;
}
