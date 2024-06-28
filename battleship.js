import Board from './utils/board.js';
import Coord from './utils/fakeCoord.js';

const main = document.querySelector('main');
const bShip = document.querySelectorAll('.b-ship');
const boardDims = 8;
let coords;
let hovCoor = {};
let dreadnought;
let playerBoard;
let statusObj;
let foeBoard;
let shipWidth;

const switchCoordFunc = (event) => {
    const e = event.target;
    const type = event.type;

    if (type === 'mouseenter') e.style.filter = 'brightness(180%)'
    if (type === 'mouseleave') e.style.removeProperty('filter')
};

const shipRotator = (event) => {
    const pressed = event.code;
    
    if (pressed === 'Space') {
        const selected = document.querySelector('[data-select="1"]');

        if (selected.dataset.orient === 'h') {
            selected.style.rotate = '90deg';
            selected.dataset.orient = 'v';
        } else {
            selected.style.removeProperty('rotate');
            selected.dataset.orient = 'h';
        }
    }

    placeMode();
    if (Object.hasOwn(hovCoor, 'dataset')) shipPreview();
};

const shipPreview = (event) => {
    const e = event ? event.target : hovCoor;
    const col = Number(e.dataset.coor[1]);
    const selected = document.querySelector('[data-select="1"]');
    const shipLength = Number(selected.dataset.length);
    const row = e.dataset.coor[0];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const rowIndex = rows.indexOf(row);
    hovCoor = new Coord(e);
    
    if (selected.dataset.orient === 'h') {
        if ((col + shipLength) < (boardDims + 1)) {
            for (let i = 0; i < shipLength; i++) {
                const coord = document.querySelector(`[data-coor="${row}${i + col}"]`);
                coord.style.removeProperty('opacity');
                coord.style.filter = 'brightness(150%)';
            }
        } else {
            for (let i = 0; i < shipLength; i++) {
                const coord = document.querySelector(`[data-coor="${row}${i + (boardDims / 2) + 1}"]`);
                coord.style.removeProperty('opacity');
                coord.style.filter = 'brightness(150%)';
            }
        }
    } else {
        if ((rowIndex + shipLength) < (boardDims + 1)) {
            for (let i = 0; i < shipLength; i++) {
                const coord = document.querySelector(`[data-coor="${rows[rowIndex + i]}${col}"]`);
                coord.style.removeProperty('opacity');
                coord.style.filter = 'brightness(150%)';
            }
        } else {
            for (let i = 0; i < shipLength; i++) {
                const coord = document.querySelector(`[data-coor="${rows[i + (boardDims / 2)]}${col}"]`);
                coord.style.removeProperty('opacity');
                coord.style.filter = 'brightness(150%)';
            }
        }
    }
};

const placeMode = () => {
    coords.forEach(coord => {
        coord.style.opacity = '.5';
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
        selected.style.removeProperty('rotate');
        selected.style.removeProperty('scale');
        selected.style.removeProperty('left');
        selected.style.top = '-20%';
        selected.dataset.orient = 'h';
        selected.dataset.select = '0';

        coords.forEach(coord => {
            coord.style.removeProperty('opacity');
            coord.style.removeProperty('filter');
            coord.removeEventListener('mouseenter', shipPreview);
            coord.removeEventListener('mouseleave', resetPlaceMode);
        });
    }
};

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

const moveShip = (event) => {
    const selected = document.querySelector('[data-select="1"]');
    const boardPos = document.querySelector('[data-coor="A1"]').getBoundingClientRect();
    
    selected.style.scale = `.4`
    selected.style.left = `${event.clientX - boardPos.left - (shipWidth * .8)}px`;
    selected.style.top = `${event.clientY - boardPos.top}px`;
};

const selectShip = (event) => {
    const e = event.target;
    
    coordsHover(false);
    placeMode();
    
    e.dataset.select = '1';
    shipWidth = e.getBoundingClientRect().width * .4;
    
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
    const newPlayerBoard = new Board({type: 'player', dims: boardDims});
    
    newPlayerBoard.appendShips();
    newPlayerBoard.appendRows();
    
    playerBoard = newPlayerBoard.boardEl;

    main.appendChild(playerBoard);
    
    coords = document.querySelectorAll('.coord');
    dreadnought = document.querySelector('#dreadnought');

    coordsHover(true);
    dreadnought.addEventListener('click', selectShip);
};

window.onload = initBoards();