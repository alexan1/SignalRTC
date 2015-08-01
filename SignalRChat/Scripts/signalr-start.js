// Declare a proxy to reference the hub.
//var url = window.location.href;
//trace('url = ' + url);
var scripts = document.getElementsByTagName("script"),
    src = toLocation(scripts[scripts.length - 1].src).origin;
$.connection.hub.url = src + "/signalr";
trace('connection url = ' + $.connection.hub.url);
var chat = $.connection.chatHub;