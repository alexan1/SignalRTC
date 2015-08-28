$('#video').hide();

$('#myModal').modal('show');
//$('#myname').modal('show');

//starting();

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

$('#start1').click(function () {
    $('#myname').modal('show');
});

//$('#userform').submit(function (event) {
        
//    //event.preventDefault();

//    $('#content').show();
//    if (navigator.getUserMedia) {
//        $('#device').show();
//    }
//    else {
//        $('#device').hide();
//    }
//    $('#video').hide();
//    $('#audio').hide();
//    $('#info').hide();
//    $('#start').hide();
//    $('#call').hide();
//    starting();

//    });

$('#start2').click(function () {
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

$('#user').keypress(function (e) {
    if (e.which == 13) {//Enter key pressed
        $('#start2').click();
    }
});

$('#videocam').click(function () {   
    $('#video').toggle();    
    if ($('#localVideo').is(':visible')) {       
        startDev(1);
        connect();
    }
    else {
        if (localStream != undefined) {
            localStream.stop();
        };
        $('#videocam').html(camoff);
        chat.server.activateMedia(0);
        $('#call').hide();
    }
});

$('#mic').click(function () {
    $('#video').toggle();
    if ($.trim($(this).html()) === micoff) {
        $(this).html(micon);
        startDev(2);
        connect();
    }
    else {
        if (localStream != undefined) {
            localStream.stop();
        };
        $(this).html(micoff);
        chat.server.activateMedia(0);
        $('#call').hide();
    }
});

var camoff = 'Webcam/Audio (ON/<strong><u>OFF</u></strong>)';
var camon = 'Webcam (<strong><u>ON</u></strong>/OFF)';
var micoff = 'Only microphone (ON/<strong><u>OFF</u></strong>)';
var micon = 'Only microphone (<strong><u>ON</u></strong>/OFF)';

$('#users').on("change", "input[type=radio]", function () {   
    var selecteduser = "";
    selecteduser = $('input:radio:checked').next().next().next().text().trim();
    console.trace('selected user = ', selecteduser);
    if (!selecteduser || selecteduser == "" || selecteduser == null) {
        $("#callButton").prop('disabled', true);
    }
    else {
         $("#callButton").prop('disabled', false);
    }

    });