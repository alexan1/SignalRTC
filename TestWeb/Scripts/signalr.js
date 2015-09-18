// Declare a proxy to reference the hub.
//var url = window.location.href;
//trace('url = ' + url);
//var scripts = document.getElementsByTagName("script"),
//    src = toLocation(scripts[scripts.length - 1].src).origin;
//$.connection.hub.url = src + "/signalr";
//trace('connection url = ' + $.connection.hub.url);
//var chat = $.connection.chatHub;

//function toLocation(url) {
//    var a = document.createElement('a');
//    a.href = url;
//    return a;
//};

//$.connection.hub.url = "https://chatroomone.azurewebsites.net/signalr";
$.connection.hub.url = "https://localhost:44301/signalr";
var chat = $.connection.chatHub;

function starting() {
    
    // Create a function that the hub can call to broadcast messages.    
    chat.client.broadcastMessage = function (priv, name, message) {
        // Html encode display name and message.      
        var encodedName = $('<div />').text(name).html();
        var encodedMsg = $('<div />').text(message).html();
        // Add the message to the page.       
        if (priv) {
            message = "<font color='blue'><small>[" + priv + "]</small></font>  " + encodedMsg;
        };
        message = message + "    <font color='Gray'><small>" + getTime() + "</small></font>";
        $discussion.prepend('<li><strong>' + encodedName
            + '</strong>:&nbsp;&nbsp;' + message + '</li>');

        var audio = new Audio('/sound/page-flip-01a.mp3');
        audio.play();
    };

    chat.client.showUsersOnLine = function (users) {
        //var users1 = users.filter(function (el) { return el.Name != $displayname.val(); });
        var usersdata1 = JSON.parse(users);
        console.log("my name = " + $displayname.val());
        var usersdata = usersdata1.filter(function (el) { return el.Name != $displayname.val(); });

        //myArray = myArray.filter(function (obj) {
        //    return obj.field !== 'money';
        //});

        console.trace('users = ' + users);
        console.trace('usersdata1 = ' + usersdata1);
        console.trace('usersdata = ' + usersdata);
        //console.trace('names = ' + users[0].Name);
        //console.trace('namesdata = ' + usersdata[0].Name);
        //console.trace('connection = ' + usersdata[0].ConnectionId);
        //console.trace('browsers = ' + usersdata[0].Browser);
        //console.trace('medias = ' + usersdata[0].BroMedia);
        
        //var keysarray = users.keys.toString().split(',');
        //var conarray = users.connection.toString().split(',');
        //var browserarray = users.browsers.toString().split(',');
        //var mediaarray = users.medias.toString().split(',');
        //var number = usersdata.Name.indexOf($displayname.val());
        //keysarray.splice(number, 1);
        //conarray.splice(number, 1);
        //browserarray.splice(number, 1);
        //mediaarray.splice(number, 1);
        //usersdata.splice(number, 1);
        if (usersdata[0] != null) {
            var audio = new Audio('/sound/bottle-open-1.mp3');
            audio.play();
            var i;
            $users.empty();
            $users.append('<input type="radio" value= "public" name="user" checked><label>Public</label><br />');
            for (i = 0; i < usersdata.length; i++) {
                var connectionId = usersdata[i].ConnectionId;
                var media = usersdata[i].BroMedia;
                console.trace('media = ' + media);
                var med = " ";
                switch (media) {
                    case 0:                        
                        med = " ";
                        break;
                    case 1:
                        med = "WebCam";
                        break;
                    case 2:
                        med = "Mic";
                        break;
                    default:
                        med = "Nothing";
                        break;
                }                
                console.trace('med = ' + med);
                
                $users.append('<input type="radio" value= connectionId name="user" checked><label>' + usersdata[i].Name + ' </label>  <label><font color="Green"><small>/' + usersdata[i].Browser + '/ </small></font></label><label><font color="Red"><small>  ' + med + '</small></font><br/></label><br/>');
                $('input[name="user"]:checked').val(usersdata[i].ConnectionId);
            }
            $('input[name="user"][value="public"]').prop('checked', true);            
        }
        else {
            $users.empty();
        }
        $callButton.prop('disabled', true);
    };

    chat.client.hangUpVideo = function () {
        hangup();
    };

    chat.client.sendOffer = function (desc) {
        trace('Offer sent ' + desc);
        answer(JSON.parse(desc));
    };

    chat.client.sendIce = function (desc) {
        trace('Ice sent ' + desc);
        addIceCandidate(JSON.parse(desc));
    };

    chat.client.sendAnswer = function (desc) {
        trace('Answer sent ' + desc);
        getAnswer(JSON.parse(desc));
    };

    getUserName();
    startHub();    
};

function getUserName() {
    // Get the user name and store it to prepend to messages.
    var name = "";
    name = getUrlVars()["user"];
    //trace('user1 = ' + name);
    if (!(name) || name == "undefined") {
        var name = $user.val();       
    }
    name = $.trim(name);
    console.trace('user2 = ' + name);
    if (!(name) || name == null) {
        name = generateQuickGuid();
        //trace('user = ' + name);
    }
    console.trace('user = ' + name);
    console.trace('browser = ' + webrtcDetectedBrowser);
    $myname.val(name);
    $displayname.val(name);
    // Set initial focus to message input box.
    $message.focus();
    // Start the connection.
    $.connection.hub.qs = "userName=" + name + "&browser=" + webrtcDetectedBrowser;    
};

function startHub() {
    $.connection.hub.start().done(function () {
        $sendmessage.click(function () {
            // Call the Send method on the hub.           
            var conn = $('input[name="user"]:checked').val();
            var conname = $('input[name="user"]:checked').next().text().split(' ')[0];
            console.trace('conn = ' + conn + '/' + conname);
            if (conn == "public") {
                chat.server.send($displayname.val(), $message.val());
            }
            else {
                chat.server.sendToUser(conname, conn, $displayname.val(), $message.val());
            }
            // Clear text box and reset focus for next comment.
            $message.val('').focus();
        });

        $message.keypress(function (e) {
            if (e.which == 13) {//Enter key pressed
                $sendmessage.click();
            }
        });
        $clearMessages.click(function () {
            $discussion.empty();
        });        
    });
};

   