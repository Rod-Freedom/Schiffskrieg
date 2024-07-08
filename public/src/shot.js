export default class Shot {
    constructor (coor, hit, ship, playerId, matchId) {
        this.coor = coor;
        this.hit = hit,
        this.sink = ship,
        this.playerId = playerId === undefined ? playerId : '';
        this.matchId = matchId === undefined ? matchId : '';
    }
}