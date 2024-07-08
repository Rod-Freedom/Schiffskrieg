const socket = io();

let playerNum = 0;

socket.on('connect', () => {
    console.log(`Connected to room: ${socket.id}`)
})

socket.on('player-number', (number) => {
    console.log(`You are player ${number}`);
    playerNum = number;
})

socket.on('full-server', () => {
    console.log('Sorry the server is full.')
})

socket.on('player-connection', (number) => {
    console.log(`Player ${number} has connected`);
})

socket.emit('take-shot', 'A1')