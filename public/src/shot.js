export default class Shot {
    constructor (coor, hit, sink, ship) {
        this.coor = coor;
        this.hit = hit,
        this.sink = {
            sink: sink,
            ship: ship,
        };
    }

    static take (coord) {
        console.log(coord)
    }
}