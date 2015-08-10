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
        $('#videocam').show();
    }
    else {
        $('#videocam').hide();
    }
    $('#video').hide();
    $('#info').hide();
    $('#start').hide();
    starting();
});

$('#videocam').click(function () {   
    $('#video').toggle();    
    if ($('#localVideo').is(':visible')) {
        //$('#videocam').html('Webcam (<strong><u>ON</u></strong>/OFF)');
        start(true);
    }
    else {
        localStream.stop();
        $('#videocam').html('Webcam (ON/<strong><u>OFF</u></strong>)');
    }
});
