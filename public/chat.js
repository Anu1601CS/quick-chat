// Make connection
var socket = io.connect('http://localhost:1234/');

// Query DOM
var message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    btn = document.getElementById('send'),
    quit = document.getElementById('quit'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback');

// Emit events
btn.addEventListener('click', function () {
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });
    message.value = "";
});

// Emit events
quit.addEventListener('click', function () {
    socket.emit('chat', {
        message: 'Left the group chat.',
        handle: handle.value
    });
    message.value = "";
    localStorage.setItem("quit", handle.value);
    output.innerHTML += '<p><strong>' + handle.value + ': </strong> You left the group chat.</p>';
});

message.addEventListener('keypress', function () {
    socket.emit('typing', handle.value);
})


// Listen for events
socket.on('chat', function (data) {
    feedback.innerHTML = '';
    if (localStorage.getItem("quit") != data.handle) {
        output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
    }
});

socket.on('typing', function (data) {
    if (localStorage.getItem("quit") != data) {
        feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
    }
});
