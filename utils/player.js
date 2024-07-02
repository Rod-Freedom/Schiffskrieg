import Board from "./board.js";
import Ship from "./ships.js";

export default class Player extends Board {
    constructor ({ type, dims, nShips, slotOne, slotTwo }) {
        super({ type: type, dims: dims, })
        this.nShips = nShips;
        this.ships = [
            { size: 2, id: 'uboat', },
            { size: 3, id: 'destroyer', },
            { size: 4, id: 'dreadnought', },
        ];
        this.slotOne = slotOne;
        this.slotTwo = slotTwo;
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