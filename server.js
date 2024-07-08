const path = require('path');
const SocketTracker = require('./public/src/socketTracker.js');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { Match } = require('./models');
const { Shots } = require('./models');

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
const { match } = require('assert');

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
io.engine.use(sessionMiddleware);

sequelize.sync({ force: false }).then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Application is ruunint at: http://localhost:${PORT}`);
  });
});


let isGame = false;
const player1 = { number: 1, connected: false, ready: false };
const player2 = { number: 2, connected: false, ready: false };
const players = [player1, player2];

let matchId;
let playersIds = [];

io.on('connection', (socket) => {

  let playerNum;
  const playerId = socket.request.session.player_id;

  for (const id of playersIds) {
    if (id === playerId) {
      return;
    }
  }
  playersIds.push(playerId);


  for (const i in players) {
    if (!players[i].connected) {
      playerConnection(socket, players[i]);
      playerNum = Number(i) + 1;
      break;
    } else if (players[0].connected && players[1].connected) {
      console.log('Additional player connection attempted');
      return;
    }
  }

  socket.on('disconnect', () => {
    if (isGame) endGame();
    players[playerNum - 1].connected = false;
    players[playerNum - 1].ready = false;
    playersIds.splice(playersIds.indexOf(playerId, 1));
    console.log(`Player ${playerNum} disconnected.`);
  });

  // –––––––––––––––––––––––––––––––––––––––––––
  // in-game funcs
  socket.on('send-ships', async (ships, player) => {
    if (player === 1) {
      gameTracker.playerOneShips = ships;
      players[0].ready = true;
    } else {
      gameTracker.playerTwoShips = ships;
      players[1].ready = true;
    }
    if (players[0].ready && players[1].ready) {
      const match = await Match.create();
      matchId = match.dataValues.match_id;
      socket.broadcast.emit('init-game', true);
      socket.emit('init-game', true);
      isGame = true;
    }
  });

  socket.on('take-shot', coord => console.log(coord, 'hi'));
});

// server funcs
function playerConnection(socket, player) {
  player.connected = true;
  console.log(`player ${player.number} connected`);
  socket.emit('player-number', player.number);
  socket.broadcast.emit('player-connection', player.number);
};

const endGame = async () => {

}