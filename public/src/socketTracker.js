class Tracker {
    constructor(nShips) {
        this.nShips = nShips;
        this.sinkedPlOne = 0;
        this.sinkedPlTwo = 0;
        this.playerOneShips = [];
        this.playerTwoShips = [];
        this.playersPoints = [0, 0];
        this.shots = [];
    }

    shotMulti(coor, player, playerId, matchId) {
        let playerShips;
        let hit = false;
        let ship = null;

        if (player === 1) playerShips = this.playerTwoShips
        else playerShips = this.playerOneShips

        playerShips.forEach(shipObj => {
            if (shipObj.coords.includes(coor)) {
                hit = true;
                shipObj.hits.push(coor);
                if (shipObj.hits.length === shipObj.coords.length) {
                    ship = shipObj.id;
                }
            }
        })

        const shot = new Shot(coor, hit, ship, playerId, matchId);
        return shot
    }
    reset(nShips) {
        this.nShips = nShips;
        this.sinkedPlOne = 0;
        this.sinkedPlTwo = 0;
        this.playerOneShips = [];
        this.playerTwoShips = [];
        this.playersPoints = [0, 0];
        this.shots = [];
    }
}

class Shot {
    constructor(coor, hit, ship, playerId, matchId) {
        this.coor = coor;
        this.hit = hit;
        this.sink = ship;
        this.playerId = playerId === undefined ? playerId : '';
        this.matchId = matchId === undefined ? matchId : '';
    }
}

module.exports = Tracker;