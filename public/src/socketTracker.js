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
        this.turn = 0;
        this.turns = [];
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



    foeShotMulti (coor) {
        let hit = false;
        let sink = true;
        let ship = null;
        this.playerShips.forEach(shipObj => {
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

    playerShot (coor) {
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

module.exports = Tracker;