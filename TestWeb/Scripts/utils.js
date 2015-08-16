$('#content').hide();

function generateQuickGuid() {
    return Math.random().toString(36).substring(2, 15);
        //+ Math.random().toString(36).substring(2, 15);
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


$('#start').click(function () {
    $('#content').show();
    if (navigator.getUserMedia) {
        $('#device').show();
    }
    else {
        $('#device').hide();
    }
    $('#video').hide();
    $('#audio').hide();
    $('#info').hide();
    $('#start').hide();
    $('#call').hide();
    starting();
});

$('#videocam').click(function () {   
    $('#video').toggle();    
    if ($('#localVideo').is(':visible')) {
        //$('#videocam').html('Webcam (<strong><u>ON</u></strong>/OFF)');
        startDev(1);
        connect();
    }
    else {
        localStream.stop();
        $('#videocam').html(camoff);
        chat.server.activateMedia(0);
        $('#call').hide();
    }
});

$('#mic').click(function () {
        
    if ($.trim($(this).html()) === micoff) {
        $(this).html(micon);
        startDev(2);
        connect();
    }
    else {
        localStream.stop();
        $(this).html(micoff);
        chat.server.activateMedia(0);
        $('#call').hide();
    }
});

var camoff = 'Webcam/Audio (ON/<strong><u>OFF</u></strong>)';
var camon = 'Webcam (<strong><u>ON</u></strong>/OFF)';
var micoff = 'Only microphone (ON/<strong><u>OFF</u></strong>)';
var micon = 'Only microphone (<strong><u>ON</u></strong>/OFF)';