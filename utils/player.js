const Board = require("./board.js");
const Ship = require("./ships.js");

class Player extends Board {
    constructor ({ dims, nShips, slotOne, slotTwo, rows }) {
        super({ dims, rows, type: 'player'})
        this.nShips = nShips;
        this.ships = [
            { size: 2, id: 'uboat', },
            { size: 3, id: 'destroyer', },
            { size: 4, id: 'dreadnought', },
        ];
        this.slotOne = slotOne;
        this.slotTwo = slotTwo;

        this.boardInit()
    }

    appendShips () {
        for (let i = 0; i < this.nShips; i++) {
            const ship = Ship.shipFactory(this.ships[i]);
            const id = this.ships[i].id;
            if (id === 'uboat' || id === 'destroyer') this.slotOne.appendChild(ship)
            if (id === 'dreadnought') this.slotTwo.appendChild(ship)
        }
    }

    boardInit () {
        this.appendShips()
        this.appendRows()
    }
}

module.exports = Player;