'use strict';
   
    $callButton.prop('disabled', true);
    $callButton.click(function () {
        console.trace("Call me!");
        call();
    });
    $hangupButton.click(function () {
        chat.server.hangUp();
    });       

    var startTime;
    var localStream;
    var connection;
    
    var sdpConstraints = {
        'mandatory': {
            'OfferToReceiveAudio': true,
            'OfferToReceiveVideo': true
        }
    };

    $localVideo.on('loadedmetadata', function () {
        trace('Local video currentSrc: ' + this.currentSrc +
          ', videoWidth: ' + this.videoWidth +
          'px,  videoHeight: ' + this.videoHeight + 'px');
    });

    $remoteVideo.on('loadedmetadata', function () {
        trace('Remote video currentSrc: ' + this.currentSrc +
          ', videoWidth: ' + this.videoWidth +
          'px,  videoHeight: ' + this.videoHeight + 'px');
    });

    $remoteVideo.onresize = function () {
        trace('Remote video size changed to ' +
          $remoteVideo.videoWidth + 'x' + $remoteVideo.videoHeight);
        // We'll use the first onsize callback as an indication that video has started playing out.
        if (startTime) {
            var elapsedTime = window.performance.now() - startTime;
            trace('Setup time: ' + elapsedTime.toFixed(3) + 'ms');
            startTime = null;
        }
    };   

    function selectDevice() {
        navigator.mediaDevices.enumerateDevices().then(function (devices) {
        var camnumber = 0;
        var micnumber = 0;
        devices.forEach(function(device) {
        console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
        
        if (device.kind == 'videoinput') {
            camnumber++;
            $camdev.append($('<option/>', { 
                value: device.deviceId,
                text: device.label || "Webcam" + camnumber
            }));
        } else {
            micnumber++;
            $micdev.append($('<option/>', { 
                value: device.deviceId,
                text: device.label || "Microphone" + micnumber
            }));
        };
        });

        if (camnumber == 0) {
            $camdev.hide();
            $videocam.prop('disabled', true);
        }
        if (micnumber == 0) {
            $micdev.hide();
            $mic.prop('disabled', true);
        }
       
}) 
.catch(function(err) {
    console.log(err.name + ": " + err.message);
});
        
    }

    function startDev(media) {
        var audioId = $('#micdev').val();
        var videoId = $('#camdev').val();        
        $remoteVideo.hide();
        $callButton.prop('disabled', true);
        $hangupButton.prop('disabled', true);       
        console.trace('media = ' + media);
        var constraints;
        switch (media) {
            case 1:
                constraints = {
                    audio: {
                        optional: [{
                            sourceId: audioId
                        }]
                    },
                    video: {
                        optional: [{
                            sourceId: videoId
                        }]
                    }
                };
                $videocam.html(camon);
                break;
            case 2:
                constraints = {
                    video: false, audio: {
                        optional: [{
                            sourceId: audioId
                        }]
                    }
                };
                $mic.html(micon);
                break;
            default:
                constraints = { audio: false, video: false };
                break;
        }
        
        if (navigator.getUserMedia) {
            navigator.mediaDevices.getUserMedia(constraints)
            .then(gotStream)
            .catch(errorWebCam)
        };

        //    navigator.getUserMedia(constraints,
        //    gotStream, errorWebCam);
        //};
    }

    function connect() {
        if (RTCPeerConnection) {
            var servers = { 'iceServers': [{ 'urls': 'stun:74.125.142.127:19302' }] };
            //var  _iceServers = [{ url: 'stun:74.125.142.127:19302' }], // stun.l.google.com - Firefox does not support DNS names.
            
            connection = new RTCPeerConnection(servers);            
            connection.onicecandidate = function (e) {

                chat.server.iceCandidate(JSON.stringify({ "candidate": e.candidate }));
            };
            connection.onaddstream = function (e) {
                // Call the polyfill wrapper to attach the media stream to this element.
                $callButton.prop('disabled', true);
                $device.hide();
                attachMediaStream(remoteVideo, e.stream);
                trace('received remote stream');
            };
            $call.show();
        }
        else {
            $call.hide();
            $alert1.show();
        };
}

function call() {
    var conn = $('input[name="user"]:checked').val();
    trace('conn1 = ' + conn);
    if (conn == "public") {
        alert("Sorry, you need to select user with whom you want to have video chat.");        
        return;
    }
    $callButton.prop('disabled', true);
    $remoteVideo.show(function() {
            $device.hide();
        });    
   
    $hangupButton.prop('disabled', false);
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
    $remoteVideo.show();    
    $hangupButton.prop('disabled', false);
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
    var media = 0;
    if (stream.getVideoTracks().length) {
        $videocam.html(camon);
        attachMediaStream($("#localVideo")[0], stream);
        media = 1;
    }
    else {
        $mic.html(micon);
        media = 2;        
    }
    localStream = stream;   
    chat.server.activateMedia(media);
}

function onCreateOfferSuccess(desc) {
    trace('Offer created'); 
    trace('setLocalDescription start');
    var conn = $('input[name="user"]:checked').val();
    trace('conn2 = ' + conn);
    $device.hide();
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
    $localVideo.hide();
    $videocam.html(camoff);
    $call.hide();
};

var errorMic = function (err) {
    console.error(err);
    alert('Sorry, Mic is absent');    
    $video.hide();
    $callButton.prop('disabled', true);
    $mic.html(micoff);
    $call.hide();
};

function hangup() {
  trace('Ending call');
  connection.close();  
  connection = null;    
  $remoteVideo.hide();
  $device.show();   
  connect();  
  $hangupButton.prop('disabled', true);  
}
