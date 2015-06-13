'use strict';

    var callButton = document.getElementById('callButton');
    var hangupButton = document.getElementById('hangupButton');
    callButton.disabled = false;    
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

    function start() {
        remoteVideo.hidden = true;
        hangupButton.disabled = true;
    // Call into getUserMedia via the polyfill (adapter.js).
        getUserMedia({ audio: true, video: true },
        gotStream,
    function(e) {
        //alert('getUserMedia() error: ' + e.name);
        alert('Sorry, you web cam is absent or unavailable');
        callButton.disabled = true;
    });
  //var servers = null;
  //var servers = { 'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }] };
  var servers = { 'iceServers': [{ 'urls': 'stun:74.125.142.127:19302' }] };
  //var  _iceServers = [{ url: 'stun:74.125.142.127:19302' }], // stun.l.google.com - Firefox does not support DNS names.
  connection = new RTCPeerConnection(servers);
  //connection = new RTCPeerConnection({ iceServers: _iceServers });
  trace('Created connection object');  
  connection.onicecandidate = function (e) {      
      chat.server.iceCandidate(JSON.stringify({ "candidate": e.candidate }));
  };
  connection.onaddstream = function (e) {      
      // Call the polyfill wrapper to attach the media stream to this element.
      callButton.disabled = true;
      //remoteVideo.hidden = false;
      attachMediaStream(remoteVideo, e.stream);
      trace('received remote stream');
  };     
}

function call() {
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
  connection.createOffer(onCreateOfferSuccess, onCreateSessionDescriptionError);
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
                },
                function(e) {
                    //alert('getUserMedia() error: ' + e.name);
                    alert('Sorry, not set local description');
                    //callButton.disabled = true;
                });
            },
            function (e) {
                //alert('getUserMedia() error: ' + e.name);
                alert('Sorry, not set local description');
                //callButton.disabled = true;
            });
    },
    function (e) {
        //alert('getUserMedia() error: ' + e.name);
        alert('Sorry, not set remote description');
        //callButton.disabled = true;
    });
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

function onCreateSessionDescriptionError(error) {
  trace('Failed to create session description: ' + error.toString());
}

function onCreateOfferSuccess(desc) {
    trace('Offer created'); 
  trace('setLocalDescription start');
  connection.setLocalDescription(desc, function () {
    chat.server.offer(JSON.stringify({ "sdp": desc }));
    onSetLocalSuccess(connection);
  },
  function(e) {
      //alert('getUserMedia() error: ' + e.name);
      alert('Sorry, not set local description');
      //callButton.disabled = true;
  });
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
  },
  function (e) {
      //alert('getUserMedia() error: ' + e.name);
      alert('Sorry, not set local description');
      //callButton.disabled = true;
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
  //connection.close();  
  //connection = null;
  //start();
  hangupButton.disabled = true;
  callButton.disabled = false;
  remoteVideo.hidden = true;
}
