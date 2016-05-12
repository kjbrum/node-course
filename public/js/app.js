var socket = io();

socket.on('connect', function() {
    console.log('Connected via socket.io - front end');
});
