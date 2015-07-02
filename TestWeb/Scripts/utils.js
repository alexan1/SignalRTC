$('#content').hide();


$('#start').click(function () {
    $('#content').show();
    $('#video').hide();
    $('#info').hide();
    $('#start').hide();
    starting();
});

$('#videocam').click(function () {   
    $('#video').show();
    $('#videocam').hide();
    start(true);
});
