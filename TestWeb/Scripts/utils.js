var ua = navigator.userAgent.toLowerCase();
var isAndroid = ua.indexOf("android") > -1;
console.log(ua);
//isAndroid = true;
console.log("isAndroid = " + isAndroid);

//var android = 'false';
//android = localStorage.android;
//var name1 = localStorage.userName;
var username = localStorage.userName;

if (username != 'undefined' && username != undefined) {
    //connect(name);
    start2();
    //$myname.modal('show');
}
else {
    if (isAndroid || localStorage.nexttime == 'false') {
        $myname.modal('show');
    } else {
        $myModal.modal('show');
    };
};

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log("Name: " + profile.getName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());
    localStorage.userName = profile.getName();

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
    $start2.click();
};

function generateQuickGuid() {
    return Math.random().toString(36).substring(2, 15);       
}

function getTime() {
    var dt = new Date();
    return dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

$start1.click(function () {
    if (typeof (Storage) !== "undefined") {
        localStorage.nexttime = true;
        if ($nexttime.is(':checked')) {
            localStorage.nexttime = false;
        }
    } else {
        console.log("Sorry! No Web Storage support..");
    }
    console.log("next time " + localStorage.nexttime);
    $myname.modal('show');
});


$start2.click(function () {
    start2();
    //if (navigator.getUserMedia) {
    //    $device.show();
    //    if (isAndroid)
    //    {
    //        $camdev.hide();
    //        $micdev.hide();
    //        $mic.hide();
    //    }
    //    else
    //    {
    //        selectDevice();
    //    }
    //}
    //else {
    //    $device.hide();
    //    $alert1.show();
    //}
    //$video.hide();   
    //$call.hide();
    starting();
});


function start2() {
    if (navigator.getUserMedia) {
        $device.show();
        if (isAndroid) {
            $camdev.hide();
            $micdev.hide();
            $mic.hide();
        }
        else {
            selectDevice();
        }
    }
    else {
        $device.hide();
        $alert1.show();
    }
    $video.hide();
    $call.hide();
    starting();
}

$user.keypress(function (e) {
    if (e.which == 13) {//Enter key pressed
        $start2.click();
    }
});

$videocam.click(function () {   
    $video.toggle();    
    if ($localVideo.is(':visible')) {       
        startDev(1);
        connect();
    }
    else {
        if (localStream != undefined) {            
            var videoTracks = localStream.getVideoTracks();
            videoTracks[0].stop()
            var audioTracks = localStream.getAudioTracks();
            audioTracks[0].stop();           
        };
        $videocam.html(camoff);
        chat.server.activateMedia(0);
        $call.hide();
    }
});

$mic.click(function () {
    $video.toggle();
    if ($.trim($(this).html()) === micoff) {
        $(this).html(micon);
        startDev(2);
        connect();
    }
    else {
        if (localStream != undefined) {
            var audioTracks = localStream.getAudioTracks();
            audioTracks[0].stop();
        };
        $(this).html(micoff);
        chat.server.activateMedia(0);
        $call.hide();
    }
});

var camoff = 'Webcam/Audio (ON/<strong><u>OFF</u></strong>)';
var camon = 'Webcam (<strong><u>ON</u></strong>/OFF)';
var micoff = 'Only microphone (ON/<strong><u>OFF</u></strong>)';
var micon = 'Only microphone (<strong><u>ON</u></strong>/OFF)';

$users.on("change", "input[type=radio]", function () {   
    var selecteduser = "";
    selecteduser = $('input:radio:checked').next().next().next().text().trim();
    console.trace('selected user = ', selecteduser);
    if (!selecteduser || selecteduser == "" || selecteduser == null) {
        $callButton.prop('disabled', true);
    }
    else {
         $callButton.prop('disabled', false);
    }

    });