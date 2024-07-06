const Shot = require("./shot.js");

class Tracker {
    constructor ({ dims, nShips, rows }) {
        this.dims = dims;
        this.rows = rows.toSpliced(dims);
        this.nShips = nShips;
        this.shipTypes = { four: 'dreadnought', three:'destroyer', two:'uboat' };
        this.sinkedOwn = 0;
        this.sinkedFoe = 0;
        this.playerCoordTracker = this.addCoords(true);
        this.playerShips = [];
        this.turn = 0;
        this.turns = [];
        this.foeCoordTracker = this.addCoords(true);
        this.foeShips = [];
    }

    addPlayerShip (coords) {
        const newShip = new ShipObj(coords, this.shipTypes);

        this.playerShips.push(newShip);
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
    
    addFoeShips () {
        const coordMapping = this.addCoords(false);
        const orients = ['v', 'h'];

        for (let iship = 0; iship < this.nShips; iship++) {
            const possibles = [];
            const shipSize = iship + 2;
            const shipOrient = orients[Math.floor(Math.random() * 2)];
            let shipCoords = [];

            if (shipOrient === 'v') {
                for (let irow = 0; irow < (this.dims - shipSize); irow++) {
                    for (let icol = 1; icol <= this.dims; icol++) {
                        const coord = `${this.rows[irow]}${icol}`;

                        const checkPossibility = () => {
                            let possible = true;
                            for (let isize = 0; isize < shipSize; isize++) {
                                const row = this.rows[irow + isize];
                                const option = `${row}${icol}`
                                
                                if (coordMapping[option].occupied === true) possible = false
                            }

                            return possible
                        };

                        if (checkPossibility()) possibles.push(coord)
                    }
                }
            } else {
                for (let icol = 1; icol <= (this.dims - shipSize); icol++) {
                    for (let irow = 0; irow < this.dims; irow++) {
                        const coord = `${this.rows[irow]}${icol}`;

                        const checkPossibility = () => {
                            let possible = true;
                            for (let isize = 0; isize < shipSize; isize++) {
                                const col = [icol + isize];
                                const option = `${this.rows[irow]}${col}`

                                if (coordMapping[option].occupied === true) possible = false
                            }

                            return possible
                        };

                        if (checkPossibility()) possibles.push(coord)
                    }
                }
            }

            const newShipCoordsFunc = () => {
                const randomCoor = possibles[Math.floor(Math.random() * possibles.length)];
                
                if (shipOrient === 'v') {
                    const initRowIndex = this.rows.indexOf(randomCoor[0]);
                    
                    for (let i = 0; i < shipSize; i++) {
                        const index = initRowIndex + i;
                        const row = this.rows[index];
                        const col = randomCoor[1];
                        const newShipCoord = `${row}${col}`;

                        shipCoords.push(newShipCoord);
                        coordMapping[newShipCoord].occupied = true;
                    }
                }
                
                if (shipOrient === 'h') {
                    const initCol = randomCoor[1];
                    
                    for (let i = 0; i < shipSize; i++) {
                        const col = Number(initCol) + i;
                        const row = randomCoor[0];
                        const newShipCoord = `${row}${col}`;

                        shipCoords.push(newShipCoord);
                        coordMapping[newShipCoord].occupied = true;
                    }
                }
            };

            newShipCoordsFunc();
            const newShip = new ShipObj(shipCoords, this.shipTypes);
            this.foeShips.push(newShip);
        }
    }

    foeShot () {

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

class ShipObj {
    constructor (coords, types) {
        this.coords = coords;
        this.size = coords.length;
        this.id = this.size === 4 ? types.four
            : this.size === 3 ? types.three
            : this.size === 2 ? types.two
            : 'none'
        ;
        this.hits = [];
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