import Board from "./board.js";

export default class Foe extends Board {
    constructor ({ dims, rows }) {
        super({ dims, rows, type: 'foe' })
        this.rowEls = this.rowElsReactor(this);
    }
}