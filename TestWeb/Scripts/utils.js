$('#content').hide();


$('#start').click(function () {
    $('#content').show();
    $('#video').hide();
    $('#info').hide();
    $('#start').hide();
    starting();
});

$('#videocam').click(function () {   
    $('#video').toggle();    
    if ($('#video').is(':visible')) {
        $('#videocam').html('Turn your webcam off');
        start(true);
    }
    else {
        $('#videocam').html('Turn your webcam on');
    }
});
