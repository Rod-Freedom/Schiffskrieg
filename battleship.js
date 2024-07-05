import Player from './utils/player.js';
import Coord from './utils/coord.js';
import Ship from './utils/ships.js';

const main = document.querySelector('main');
const shipyard = document.querySelectorAll('#shipyard');
const slotOne = document.querySelector('#slot-1');
const slotTwo = document.querySelector('#slot-2');
const boardDims = 8;
const shipScale = .4;
const playerBoardObj = {
    type: 'player',
    dims: boardDims,
    nShips: 3,
    slotOne: slotOne,
    slotTwo: slotTwo,
};
let coords;
let ships;
let hovCoor = {};
let dreadnought;
let playerBoard;
let statusObj;
let foeBoard;
let shipHwidth;
let shipHheight;
let mouseX;
let mouseY;
let gameObj;

const coordsHover = (confirm) => {
    if (confirm) {
        coords.forEach((coord) => {
            coord.addEventListener('mouseenter', switchCoordFunc);
            coord.addEventListener('mouseleave', switchCoordFunc);
        });
    } else {
        coords.forEach((coord) => {
            coord.removeEventListener('mouseenter', switchCoordFunc);
            coord.removeEventListener('mouseleave', switchCoordFunc);
        });
    }
};

const switchCoordFunc = (event) => {
    const e = event.target;
    const type = event.type;

    if (type === 'mouseenter') e.style.opacity = .7
    if (type === 'mouseleave') e.style.opacity = .3
};

const shipRotator = (event) => {
    const pressed = event.code;
    
    if (pressed === 'Space') {
        const selected = document.querySelector('[data-select="1"]');
        
        if (selected.dataset.orient === 'h') {
            selected.style.removeProperty('rotate');
            selected.dataset.orient = 'v';
        } else {
            selected.style.rotate = '-90deg';
            selected.dataset.orient = 'h';
        }
        
        const slotPos = selected.parentElement.getBoundingClientRect();
        const shipWidth = selected.getBoundingClientRect().width;
        const shipHeight = selected.getBoundingClientRect().height;

        if (selected.dataset.orient === 'v') {
            const shipExtra = shipWidth * ((1 / shipScale) - 1) * .5;
            const shipExtraTwo = shipHeight * ((1 / shipScale) - 1) * .5;
            selected.style.left = `${mouseX - slotPos.left - shipExtra}px`;
            selected.style.top = `${mouseY - slotPos.top - shipExtraTwo}px`;
        } else {
            const shipExtra = ((shipHeight / shipScale) - shipWidth) * .5;
            const shipExtraTwo = ((shipWidth / shipScale) - shipHeight) * .5;
            selected.style.left = `${mouseX - slotPos.left - shipExtra}px`;
            selected.style.top = `${mouseY - slotPos.top - shipExtraTwo}px`;
        }
    }

    placeMode();
    if (Object.hasOwn(hovCoor, 'dataset')) shipPreview();
};

const shipPreview = (event) => {
    const e = event ? event.target : hovCoor;
    const col = Number(e.dataset.coor[1]);
    const selected = document.querySelector('[data-select="1"]');
    const shipLength = Number(selected.dataset.size);
    const row = e.dataset.coor[0];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const rowIndex = rows.indexOf(row);
    hovCoor = new Coord(e);
    
    if (selected.dataset.orient === 'h') {
        if ((col + shipLength) < (boardDims + 1)) {
            for (let i = 0; i < shipLength; i++) {
                const coord = document.querySelector(`[data-coor="${row}${i + col}"]`);
                coord.style.opacity = .6;
                coord.style.filter = 'brightness(80%) grayscale(90%)';

            }
        } else {
            for (let i = 0; i < shipLength; i++) {
                const coord = document.querySelector(`[data-coor="${row}${i + (boardDims - shipLength) + 1}"]`);
                coord.style.opacity = .6;
                coord.style.filter = 'brightness(80%) grayscale(90%)';
            }
        }
    } else {
        if ((rowIndex + shipLength) < (boardDims + 1)) {
            for (let i = 0; i < shipLength; i++) {
                const coord = document.querySelector(`[data-coor="${rows[rowIndex + i]}${col}"]`);
                coord.style.opacity = .6;
                coord.style.filter = 'brightness(80%) grayscale(90%)';
            }
        } else {
            for (let i = 0; i < shipLength; i++) {
                const coord = document.querySelector(`[data-coor="${rows[i + (boardDims - shipLength)]}${col}"]`);
                coord.style.opacity = .6;
                coord.style.filter = 'brightness(80%) grayscale(90%)';
            }
        }
    }
};

const placeMode = () => {
    coords.forEach(coord => {
        coord.style.opacity = '.2';
        coord.style.removeProperty('filter');
    });
};

const resetPlaceMode = () => {
    hovCoor = {};
    placeMode();
};

const exitPlaceMode = (event) => {
    const pressed = event.code;
    const selected = document.querySelector('[data-select="1"]');

    if (pressed === 'Enter') {
        hovCoor = {};
        coordsHover(true);
        document.removeEventListener('keypress', shipRotator);
        document.removeEventListener('mousemove', moveShip);
        document.removeEventListener('keypress', exitPlaceMode);
        selected.addEventListener('click', selectShip);
        Ship.reset(selected);

        coords.forEach(coord => {
            coord.style.opacity = .3;
            coord.style.removeProperty('filter');
            coord.removeEventListener('mouseenter', shipPreview);
            coord.removeEventListener('mouseleave', resetPlaceMode);
        });

        if (selected.dataset.id === 'destroyer') {
            slotOne.classList.remove('justify-start');
            slotOne.classList.add('justify-between');
        }
        
        if (selected.dataset.id === 'uboat') {
            slotOne.classList.remove('justify-end');
            slotOne.classList.add('justify-between');
        }
    }
};

const moveShip = (event) => {
    const selected = document.querySelector('[data-select="1"]');
    const slotPos = selected.parentElement.getBoundingClientRect();
    mouseX = event.clientX;
    mouseY = event.clientY;
    selected.style.scale = shipScale;
    const shipWidth = selected.getBoundingClientRect().width;
    const shipHeight = selected.getBoundingClientRect().height;
    
    if (selected.dataset.orient === 'v') {
        const shipExtra = shipWidth * ((1 / shipScale) - 1) * .5;
        const shipExtraTwo = shipHeight * ((1 / shipScale) - 1) * .5;
        selected.style.left = `${mouseX - slotPos.left - shipExtra}px`;
        selected.style.top = `${mouseY - slotPos.top - shipExtraTwo}px`;
    } else {
        const shipExtra = ((shipHeight / shipScale) - shipWidth) * .5;
        const shipExtraTwo = ((shipWidth / shipScale) - shipHeight) * .5;
        selected.style.left = `${mouseX - slotPos.left - shipExtra}px`;
        selected.style.top = `${mouseY - slotPos.top - shipExtraTwo}px`;
    }
};

const placeShip = (event) => {
    const e = event.target;

    
};

const selectShip = (event) => {
    let e = event.target;
    if (e.dataset.id === e.id) e = e.parentElement

    if (e.dataset.id === 'destroyer') {
        slotOne.classList.remove('justify-between');
        slotOne.classList.add('justify-start');
    }
    
    if (e.dataset.id === 'uboat') {
        slotOne.classList.remove('justify-between');
        slotOne.classList.add('justify-end');
    }

    coordsHover(false);
    placeMode();
    
    e.dataset.select = '1';
    e.classList.add('absolute');
    const shipPadding = parseInt(getComputedStyle(e).getPropertyValue('padding'));
    const shipMargin = parseInt(getComputedStyle(e).getPropertyValue('margin'));
    shipHheight = (e.getBoundingClientRect().height + shipPadding) * .4;
    shipHwidth = (e.getBoundingClientRect().width + shipPadding) * .4;
    e.style.scale = shipScale;
    
    e.removeEventListener('click', selectShip);
    document.addEventListener('mousemove', moveShip);
    document.addEventListener('keypress', shipRotator);
    document.addEventListener('keypress', exitPlaceMode);

    coords.forEach((coord) => {
        coord.addEventListener('mouseenter', shipPreview);
        coord.addEventListener('mouseleave', resetPlaceMode);
    });
};

const initBoards = () => {
    const newPlayerBoard = new Player(playerBoardObj);
    
    newPlayerBoard.boardInit();
    
    playerBoard = newPlayerBoard.boardEl;

    main.appendChild(playerBoard);
    
    coords = document.querySelectorAll('.coord');
    ships = document.querySelectorAll('.ship-div');

    coordsHover(true);
    ships.forEach(ship => ship.addEventListener('click', selectShip));
};

window.onload = initBoards();