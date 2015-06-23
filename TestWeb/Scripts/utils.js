function popitup(url) {

    LeftPosition = (screen.width) ? (screen.width - 800) / 2 : 0;
    TopPosition = (screen.height) ? (screen.height - 700) / 2 : 0;
    var sheight = (screen.height) * 0.9;
    var swidth = (screen.width) * 0.8;

    settings = 'height=' + sheight + ',width=' + swidth + ',top=' + TopPosition + ',left=' + LeftPosition + ',scrollbars=yes,resizable=yes,toolbar=no,status=no,menu=no, directories=no,titlebar=no,location=no,addressbar=no'

    newwindow = window.open(url, '', settings);
    if (window.focus) { newwindow.focus() }
    return false;
}