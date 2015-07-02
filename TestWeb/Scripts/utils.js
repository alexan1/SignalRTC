$('#content').hide();

function generateQuickGuid() {
    return Math.random().toString(36).substring(2, 15);
        //+ Math.random().toString(36).substring(2, 15);
}


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
