class Tracker {
    constructor ({ dims, nShips, rows }) {
        this.dims = dims;
        this.rows = rows.toSpliced(dims);
        this.nShips = nShips;
        this.sinkedPlOne = 0;
        this.sinkedPlTwo = 0;
        this.playerOneCoordTracker = this.addCoords(true);
        this.playerTwoCoordTracker = this.addCoords(true);
        this.playerOneShips = [];
        this.playerTwoShips = [];
        this.shots = [];
    }

    addCoords (hits) {
        const coordinates = {};

        for (let irow = 0; irow < this.dims ; irow++) {
            for (let icol = 1; icol <= this.dims ; icol++) {
                const newCoord = `${this.rows[irow]}${icol}`;
                coordinates[newCoord] = new coordObj(hits, newCoord);
            }
        }

        return coordinates
    }

    playerOneShots () {

    }
    
    playerTwoShots () {

    }

    shotMulti (coor, player, playerId, matchId) {
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

    singleShot (coor) {
        let hit = false;
        let sink = true;
        let ship = null;
        this.foeShips.forEach(shipObj => {
            if (shipObj.coords.includes(coor)) {
                hit = true;
                shipObj.hits.push(coor);
                if (shipObj.hits.length === shipObj.coords.length) {
                    sink = true;
                    ship = shipObj.id;
                }
            }

        })

        const shot = new Shot (coor, hit, sink, ship);
        return shot
    }
}

class coordObj {
    constructor (hits, coor) {
        this.id = coor;
        this.state = false;
        if (!hits) this.occupied = false
    }
}

class Shot {
    constructor (coor, hit, sink, ship) {
        this.coor = coor;
        this.hit = hit,
        this.sink = {
            sink: sink,
            ship: ship,
        };
    }
}

module.exports = Tracker;