$('#content').hide();

function generateQuickGuid() {
    return Math.random().toString(36).substring(2, 15);
        //+ Math.random().toString(36).substring(2, 15);
}


$('#start').click(function () {
    $('#content').show();
    $('#info').hide();
    $('#start').hide();
    starting();
});
