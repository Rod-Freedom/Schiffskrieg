import Player from './player.js';
import Foe from './foe.js';
import Coord from './coord.js';
import Ship from './ships.js';
import Tracker from './gameTracker.js';
import Shot from './shot.js';

const socket = io();
const main = document.querySelector('main');
const lobby = document.querySelector('#lobby-screen');
const shipyard = document.querySelector('#shipyard');
const alertEl = document.querySelector('#alert');
const slotOne = document.querySelector('#slot-1');
const slotTwo = document.querySelector('#slot-2');
const boardDims = 8;
const shipScale = .4;
const playerBoardObj = {
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    dims: boardDims,
    nShips: 3,
    slotOne: slotOne,
    slotTwo: slotTwo,
};
const gameTracker = new Tracker(playerBoardObj);
let playerCoordEls;
let ships;
let hovCoor = {};
let playerBoard;
let foeBoard;
let foeCoordEls;
let mouseX;
let mouseY;
let playerNum;
let isTurn = false;

const playerCoordsHover = (confirm) => {
    if (confirm) {
        playerCoordEls.forEach((coord) => {
            if (coord.dataset.state === 'free') {
                coord.addEventListener('mouseenter', switchCoordFunc);
                coord.addEventListener('mouseleave', switchCoordFunc);
            }
        });
    } else {
        playerCoordEls.forEach((coord) => {
            coord.removeEventListener('mouseenter', switchCoordFunc);
            coord.removeEventListener('mouseleave', switchCoordFunc);
        });
    }
};

const foeCoordsHover = (confirm) => {
    if (confirm) {
        foeCoordEls.forEach((coord) => {
            if (coord.dataset.intel === 'unknown') {
                coord.addEventListener('mouseenter', switchCoordFunc);
                coord.addEventListener('mouseleave', switchCoordFunc);
                coord.addEventListener('click', sendShot);
            }
        });
    } else {
        foeCoordEls.forEach((coord) => {
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
    const rows = gameTracker.rows;
    const rowIndex = rows.indexOf(row);
    let previewCoords = [];
    hovCoor = new Coord(e);

    const shipDetector = () => {
        let detected = false;
        for (let i = 0; i < previewCoords.length; i++) {
            const coord = previewCoords[i];
            const coordEl = document.querySelector(`[data-coor="${coord}"]`);
            if (coordEl.dataset.state === 'occupied') {
                detected = true;
                break;
            }
        }

        coordSetup(detected);
    };

    const coordSetup = (detected) => {
        const currentCoord = document.querySelector(`[data-coor="${previewCoords[0]}"]`);
        
        if (detected) {
            alertEl.classList.remove('hidden');
            setTimeout(() => alertEl.classList.add('hidden'), 3000);
            selected.style.filter = 'hue-rotate(180deg)';
        } else {
            selected.style.removeProperty('filter');
        }

        previewCoords.forEach((coord) => {
            const coordEl = document.querySelector(`[data-coor="${coord}"]`);
            
            if (detected) {
                if (coordEl.dataset.state === 'free') {
                    coordEl.style.opacity = .6;
                    coordEl.style.filter = 'brightness(80%) hue-rotate(180deg)';
                    coordEl.dataset.state = 'preview';
                }
            } else {
                coordEl.style.opacity = .6;
                coordEl.style.filter = 'brightness(80%) grayscale(90%)';
                coordEl.dataset.state = 'preview';
                currentCoord.addEventListener('click', placeShip);
                currentCoord.addEventListener('mouseleave', () => currentCoord.removeEventListener('click', placeShip));
            }
        })
    };
    
    if (selected.dataset.orient === 'h') {
        if ((col + shipLength) < (boardDims + 1))
            for (let i = 0; i < shipLength; i++)
                previewCoords.push(`${row}${i + col}`)
        else
            for (let i = 0; i < shipLength; i++)
                previewCoords.push(`${row}${i + (boardDims - shipLength) + 1}`)
    } else {
        if ((rowIndex + shipLength) < (boardDims + 1))
            for (let i = 0; i < shipLength; i++)
                previewCoords.push(`${rows[rowIndex + i]}${col}`)
        else
            for (let i = 0; i < shipLength; i++)
                previewCoords.push(`${rows[i + (boardDims - shipLength)]}${col}`)
    }

    shipDetector();
};

const placeMode = () => {
    playerCoordEls.forEach(coord => {
        if (coord.dataset.state !== 'occupied') {
            coord.style.opacity = '.2';
            coord.style.removeProperty('filter');
        }
        if (coord.dataset.state === 'preview') coord.dataset.state = 'free'
    });
};

const resetPlaceMode = () => {
    const selected = document.querySelector('[data-select="1"]');
    selected.style.removeProperty('filter');
    hovCoor = {};
    placeMode();
};

const exitPlaceMode = (event) => {
    const pressed = event ? event.code : 'Enter';
    const selected = document.querySelector('[data-select="1"]');

    if (pressed === 'Enter') {
        hovCoor = {};
        playerCoordsHover(true);
        mouseX = undefined;
        mouseY = undefined;

        document.removeEventListener('keypress', shipRotator);
        document.removeEventListener('keypress', exitPlaceMode);
        document.removeEventListener('mousemove', moveShip);

        playerCoordEls.forEach(coord => {
            if (coord.dataset.state !== 'occupied') {
                coord.style.opacity = .3;
                coord.style.removeProperty('filter');
            }
            coord.removeEventListener('mouseenter', shipPreview);
            coord.removeEventListener('mouseleave', resetPlaceMode);
        });
        
        if (selected) {
            selected.addEventListener('click', selectShip)
            Ship.reset(selected);
            
            if (selected.dataset.id === 'destroyer') {
                slotOne.classList.remove('justify-start');
                slotOne.classList.add('justify-between');
            }
            
            if (selected.dataset.id === 'uboat') {
                slotOne.classList.remove('justify-end');
                slotOne.classList.add('justify-between');
            }
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
        const shipExtraX = shipWidth * ((1 / shipScale) - 1) * .5;
        const shipExtraY = shipHeight * ((1 / shipScale) - 1) * .5;
        selected.style.left = `${mouseX - slotPos.left - shipExtraX}px`;
        selected.style.top = `${mouseY - slotPos.top - shipExtraY}px`;
    } else {
        const shipExtraX = ((shipHeight / shipScale) - shipWidth) * .5;
        const shipExtraY = ((shipWidth / shipScale) - shipHeight) * .5;
        selected.style.left = `${mouseX - slotPos.left - shipExtraX}px`;
        selected.style.top = `${mouseY - slotPos.top - shipExtraY}px`;
    }
};

const shipLocator = () => {
    const previewCoordsArray = [];
    playerCoordEls.forEach(coord => {
        if (coord.dataset.state === 'preview') {
            previewCoordsArray.push(coord.dataset.coor);
        }
    });

    return previewCoordsArray
};

const placeShip = (event) => {
    const e = event.target;
    const selected = document.querySelector('[data-select="1"]');
    selected.style.removeProperty('scale');

    const previewCoords = shipLocator();
    const coordEl = document.querySelector(`[data-coor="${previewCoords[0]}"]`);
    const orient = selected.dataset.orient;
    const size = Number(selected.dataset.size);
    const coordDims = coordEl.getBoundingClientRect();
    const pBoardDims = playerBoard.getBoundingClientRect();
    const coordX = coordDims.x;
    const coordY = coordDims.y;
    const selectedProps = getComputedStyle(selected);
    const selectedMargin = Number(selectedProps.getPropertyValue('margin').slice(0, -2));
    const selectedPad = Number(selectedProps.getPropertyValue('padding').slice(0, -2));
    const coordWidth = coordDims.width + (Number(getComputedStyle(coordEl).getPropertyValue('margin').slice(0, -2)) * 2);
    const shipDims = selected.getBoundingClientRect();
    const shipWidth = shipDims.width + ((selectedMargin + selectedPad) * 2);
    const shipHeight = shipDims.height + ((selectedMargin + selectedPad) * 2);
    
    e.removeEventListener('click', placeShip);

    selected.dataset.select = 0;
    selected.classList.remove('z-50');
    selected.classList.add('z-40');
    selected.removeEventListener('click', selectShip);
    previewCoords.forEach(coor => {
        const coord = document.querySelector(`[data-coor="${coor}"]`);
        coord.dataset.state = 'occupied';
        coord.style.filter = 'brightness(30%)';
    })

    exitPlaceMode();
    
    if (orient === 'v') {
        const coordExtraX = (coordWidth - shipWidth) * .5;
        const coordExtraY = (((coordWidth * size) - shipHeight) * .5);
        playerBoard.appendChild(selected);
        selected.style.left = `${coordX + coordExtraX - pBoardDims.x}px`;
        selected.style.top = `${coordY + coordExtraY - pBoardDims.y}px`;
    } else {
        const coordExtraX = ((shipWidth - shipHeight) * .5) + (((coordWidth * size) - shipWidth) * .5);
        const coordExtraY = ((coordWidth - shipHeight) * .5) - ((shipWidth - shipHeight) * .5);
        playerBoard.appendChild(selected);
        selected.style.left = `${coordX + coordExtraX - pBoardDims.x}px`;
        selected.style.top = `${coordY + coordExtraY - pBoardDims.y}px`;
    }

    gameTracker.addPlayerShip(previewCoords);
    if (gameTracker.playerShips.length === 3) {
        socket.emit('send-ships', gameTracker.playerShips, playerNum)
    }
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

    playerCoordsHover(false);
    placeMode();
    
    e.dataset.select = '1';
    e.classList.add('absolute');
    e.style.scale = shipScale;
    
    e.removeEventListener('click', selectShip);
    document.addEventListener('mousemove', moveShip);
    document.addEventListener('keypress', shipRotator);
    document.addEventListener('keypress', exitPlaceMode);

    playerCoordEls.forEach((coord) => {
        if (coord.dataset.state !== 'occupied') {
            coord.addEventListener('mouseenter', shipPreview);
            coord.addEventListener('mouseleave', resetPlaceMode);
        }
    });
};

const sendShot = (event) => {
    const e = event.target;
    const selectedCoord = e.dataset.coor;
    e.removeEventListener('click', sendShot);
    e.dataset.intel = 'pending';


    if (isTurn === true) {
        socket.emit('take-shot', selectedCoord, playerNum);
    }
};

const initGame = () => {
    main.removeChild(shipyard);

    const newFoeBoard = new Foe(playerBoardObj);
    foeBoard = newFoeBoard.boardEl;
    

    main.appendChild(foeBoard);
    main.classList.add('justify-around');
    
    foeCoordEls = document.querySelectorAll('.coord-foe');
    foeCoordsHover(true);
};

const initBoard = () => {
    const newPlayerBoard = new Player(playerBoardObj);
    playerBoard = newPlayerBoard.boardEl;

    main.appendChild(playerBoard);
    
    playerCoordEls = document.querySelectorAll('.coord-player');
    ships = document.querySelectorAll('.ship-div');

    playerCoordsHover(true);
    ships.forEach(ship => ship.addEventListener('click', selectShip));
};

socket.on('connect', () => console.log(`You're now connected`))

socket.on('player-number', number => {
    console.log(`You are player ${number}`);
    playerNum = number;
    if (number === 2) {
        document.body.removeChild(lobby);
        initBoard();
    }
})

socket.on('full-server', () => {
    console.log('Sorry the server is full.')
})

socket.on('player-connection', number => {
    if (number === 2) {
        document.body.removeChild(lobby);
        initBoard();
    }
})

socket.on('init-game', () => {
    initGame();

    if (playerNum === 1) {
        isTurn = true;
    }
})

socket.on('your-shot', shot => {
    const shotCoord = document.querySelector('[data-intel="pending"]');

    if (!shot.hit) {
        isTurn = false;
        shotCoord.dataset.intel = 'miss';
    } else {

    }

    console.log(isTurn, 'your')
});

socket.on('foe-shot', shot => {
    if (!shot.hit) isTurn = true;
    console.log(isTurn, 'foe')
});