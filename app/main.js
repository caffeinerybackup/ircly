
$(document).keydown(function (evt) {
    if ((evt.altKey) && evt.keyCode == 49) {
        evt.preventDefault();
        alert("SWITCH");
    }
    console.log(evt.keyCode);
});

var irc = require('irc');

var client = new irc.Client('chat.kerat.net', 'testnick', {
    userName: 'testnick',
    realName: 'Hello I am Test',
    port: 6667,
    secure: false,
    channels: ['#test']
});


// helpers

function stripHTML(text) {
    // from: http://stackoverflow.com/a/4835406
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// listeners

var active_chan = "#test";

function onMessage(nick, to, text) {
    $('#messagebox').append('&lt;' + stripHTML(nick) + '&gt; ' + stripHTML(text) + '<br />');
}

function onCommand(args) {
    if (args[0] == "join") {
        client.join(args[1]);
        active_chan = args[1];
    } else if (args[0] == "nick") {
        client.send("NICK", args[1]);
        onMessage('---', active_chan, "You are now known as " + args[1]);
    }
}

client.addListener('registered', function() {
    $('#messagebox').append('connected!<br />');
});

client.addListener('error', function(message) {
    console.log('error: ', message);
});

client.addListener('message', onMessage);

client.addListener('join', function(channel) {
    $('#messagebox').append('joined ' + channel + '!<br />');
});


// actions

function sendMessage() {
    if ($('#textfield').val()[0] == "/") onCommand($('#textfield').val().substr(1).split(" "));
    else {
        onMessage('testnick', active_chan, $('#textfield').val());
        client.say(active_chan, $('#textfield').val());
    }
    $('#textfield').val('');
}

$('#submit').click(sendMessage);
$('#textfield').keypress(function(event) {
    if ((event.keyCode || event.which) == 13) sendMessage(); // 13 = return/enter key
});