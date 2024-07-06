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

module.exports = Shot;