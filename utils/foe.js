const Board = require("./board.js");

class Foe extends Board {
    constructor ({ dims, rows }) {
        super({ dims, rows, type: 'foe' })
        this.rowEls = this.rowElsReactor(this);
    }
}

module.exports = Foe;