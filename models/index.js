// const Match = require('./Match');
const Player = require('./Player');
// const Shot = require('./Shot');


// // Players can participate in multiple matches
// Player.hasMany(Match, {
//     foreignKey: 'player_1_id', 
//     as: 'Player1Matches' 
// });

// Player.hasMany(Match, {
//     foreignKey: 'player_2_id', 
//     as: 'Player2Matches' 
// });

// Player.hasMany(Match, {
//     foreignKey: 'winner_id', 
//     as: 'WonMatches' 
// });


// // Matches belong to two players
// Match.belongsTo(Player, { 
//     foreignKey: 'player_1_id', 
//     as: 'Player1'
// });

// Match.belongsTo(Player, { 
//     foreignKey: 'player_2_id', 
//     as: 'Player2'
// });

// Match.belongsTo(Player, { 
//     foreignKey: 'winner_id', 
//     as: 'Winner'
// });


// // Shots belong to a match and a shooter (player)
// Shot.belongsTo(Match, { 
//     foreignKey: 'match_id' 
// });

// Shot.belongsTo(Player, { 
//     foreignKey: 'shooter_id' 
// });

// // Matches have many shots
// Match.hasMany(Shot, { 
//     foreignKey: 'match_id' 
// });

module.exports = { Player };