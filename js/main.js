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

function onMessage(nick, to, text) {
    $('#messagebox').append('&lt;' + stripHTML(nick) + '&gt; ' + stripHTML(text) + '<br />');
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
    onMessage('testnick', '#test', $('#textfield').val());
    client.say('#test', $('#textfield').val());
    $('#textfield').val('');
}

$('#submit').click(sendMessage);
$('#textfield').keypress(function(event) {
    if ((event.keyCode || event.which) == 13) sendMessage(); // 13 = return/enter key
});