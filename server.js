const path = require('path');
const SocketTracker = require('./public/src/socketTracker.js');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { Match } = require('./models');
const { Shot } = require('./models');

// In-game tracker
const nShips = 3;
const gameTracker = new SocketTracker(nShips);

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
const player1 = { number: 1, connected: false, ready: false, id: null };
const player2 = { number: 2, connected: false, ready: false, id: null };
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
      playerConnection(socket, players[i], playerId);
      playerNum = Number(i) + 1;
      break;
    } else if (players[0].connected && players[1].connected) {
      console.log('Additional player connection attempted');
      return;
    }
  }

  socket.on('disconnect', async () => {
    if (isGame) {
      const winnerId = playerNum === 1 ? player2.id : player1.id;
      await endGame(winnerId, gameTracker);
    }
    players[playerNum - 1].connected = false;
    players[playerNum - 1].ready = false;
    players[playerNum - 1].id = null;
    playersIds.splice(playersIds.indexOf(playerId, 1));
    console.log(`Player ${playerNum} disconnected.`);
    socket.broadcast.emit('close-game');
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
      const match = await Match.create({ player_1_id: player1.id, player_2_id: player2.id });
      matchId = match.dataValues.match_id;
      gameTracker.turn++;
      socket.broadcast.emit('init-game', true);
      socket.emit('init-game', true);
      isGame = true;
    }
  })

  socket.on('take-shot', async (coor, player) => {
    const shot = gameTracker.shotMulti(coor, player, playerId, matchId);
    gameTracker.shots.push(shot);
    const shotResult = shot.hit ? "Hit" : "Miss";
    await Shot.create({ match_id: matchId, shooter_id: playerId, coordinate: shot.coor, result: shotResult });

    if (shot.sink) {
      if (player === 1) gameTracker.sinkedPlOne++;
      else gameTracker.sinkedPlTwo++;
    }


    if (shot.hit) gameTracker.playersPoints[player - 1] += 11134;
    else gameTracker.playersPoints[player - 1] -= 4325;

    if (shot.sink === 'uboat') gameTracker.playersPoints[player - 1] += 50489;
    if (shot.sink === 'destroyer') gameTracker.playersPoints[player - 1] += 78976;
    if (shot.sink === 'dreadnought') gameTracker.playersPoints[player - 1] += 99760;

    if (gameTracker.sinkedPlOne === gameTracker.nShips || gameTracker.sinkedPlTwo === gameTracker.nShips) {
      socket.emit('winner', player);
      socket.broadcast.emit('winner', player);
      await endGame(playerId, gameTracker);
      socket.emit('close-game');
      socket.broadcast.emit('close-game');
      return
    }

    socket.emit('your-shot', shot, gameTracker.playersPoints[player - 1]);
    socket.broadcast.emit('foe-shot', shot);
  });
});

// server funcs
function playerConnection(socket, player, playerId) {
  player.connected = true;
  player.id = playerId;
  console.log(`player ${player.number} connected`);
  socket.emit('player-number', player.number);
  socket.broadcast.emit('player-connection', player.number);
};

const endGame = async (playerId, gameTracker) => {
  await Match.update(
    {
      winner_id: playerId,
      player_1_points: gameTracker.playersPoints[0],
      player_2_points: gameTracker.playersPoints[1],
    },
    {
      where: {
        match_id: matchId
      }
    }
  )
  isGame = false;
  gameTracker = new SocketTracker(nShips);
}
