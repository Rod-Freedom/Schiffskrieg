const path = require('path');
const SocketTracker = require('./public/src/socketTracker.js');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// In-game tracker
const gameParamsObj = {
  dims: 8,
  nShips: 3,
  rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
};
const gameTracker = new SocketTracker(gameParamsObj);

// socket.io packages
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 3001;

// Create the Handlebars.js engine object
const hbs = exphbs.create({});

const sessionMiddleware = session({
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
});

app.use(sessionMiddleware);

// // Inform Express.js which template engine we're using
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

//Pass server to socket.io
const io = new Server(httpServer);

//Give io access to session object
// io.engine.use(sessionMiddleware);

sequelize.sync({ force: false }).then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Application is ruunint at: http://localhost:${PORT}`);
  });
});

let isGame = false;
let player1 = { number: 1, connected: false, ready: false };
let player2 = { number: 2, connected: false, ready: false };
let players = [player1, player2];

io.on('connection', (socket) => {

  // const session = socket.request.session;
  // console.log(session);
  const playerNum = 0;

  for (const i in players) {
    if (!players[i].connected) {
      playerConnection(socket, players[i]);
      playerNum = i + 1;
    } else {
      socket.emit('full-server');
      console.log('Additional player connection attempted');
      return;
    }
  }

  if (players[0].ready & players[1].ready) {
    socket.emit('start-game');
    socket.broadcast('start-game');
    isGame = true;
  };

  socket.on('disconnect', () => {
    endGame();
    console.log(`Player ${playerNum} disconnected.`);
    players[playerNum - 1].connected = false;
    players[playerNum - 1].ready = false;
  });

  // –––––––––––––––––––––––––––––––––––––––––––
  // in-game funcs
  socket.on('send-ships', (ships, player) => {
    if (player === 1) {
      gameTracker.playerOneShips = ships;
      players[0].ready = true;
    } else {
      gameTracker.playerTwoShips = ships;
      players[1].ready = true;
    }
    
    if (players[0].ready && players[1].ready) {
      socket.broadcast.emit('init-game', true);
      socket.emit('init-game', true);
      isGame = true;
    }
  })

  socket.on('take-shot', coord => console.log(coord, 'hi'))
});

// server funcs
function playerConnection(socket, player) {
  player.connected = true;
  console.log(`player ${player.number} conected`);
  socket.emit('player-number', player.number);
  socket.broadcast.emit('player-connection', player.number);
};

const endGame = async () {
  //query databases
}