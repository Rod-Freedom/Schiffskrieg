export default class Ship {
    constructor ({ size }) {
        this.size = size;
    }

    static reset (ship) {
        ship.style.removeProperty('left');
        ship.style.removeProperty('top');
        ship.classList.remove('absolute');
        
        ship.style.removeProperty('rotate');
        ship.style.removeProperty('scale');
        ship.dataset.orient = 'v';
        ship.dataset.select = '0';
    }

    static shipFactory ({ size, id }) {
        const shipDiv = document.createElement('div');
        const ship = document.createElement('div');
        
        shipDiv.classList.add('ship-div', 'z-50');
        shipDiv.id = `${id}-div`;
        shipDiv.dataset.id = id;
        shipDiv.dataset.size = size;
        shipDiv.dataset.select = '0';
        shipDiv.dataset.orient = 'v';
        
        ship.classList.add('ship');
        ship.dataset.id = id;
        ship.id = id;

        shipDiv.appendChild(ship);

        return shipDiv;
    }
}