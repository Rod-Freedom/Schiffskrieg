export default class Board {
    constructor ({ type, dims }) {
        this.type = type;
        this.boardEl = this.boardReactor(type);
        this.dims = dims;
        this.rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        this.rowEls = this.rowElsReactor(this);
    }

    rowElsReactor ({rows, dims}) {
        let rowEls = []; 
    
        rows.forEach((letter, index) => {
            if (index < dims) {
                const rowEl = document.createElement('div');
                rowEl.dataset.row = letter;
                rowEl.classList.add('row', 'w-full', 'flex', 'flex-row', 'flex-nowrap');
                
                for (let i = 0; i < dims; i++) {
                    const col = document.createElement('div');
                    col.dataset.coor = `${letter}${i + 1}`;
                    col.classList.add('coord', `coord-${this.type}`);

                    rowEl.appendChild(col);
                }
                
                rowEls.push(rowEl);
            }
        });

        return rowEls
    }

    appendRows () {
        this.rowEls.forEach(rowEl => this.boardEl.appendChild(rowEl))
    }
    
    appendDreadnought () {
        const dreadnought = document.createElement('div');
    
        dreadnought.classList.add('absolute', 'bg-blue-200', 'b-ship', 'z-50');
        dreadnought.id = 'dreadnought';
        dreadnought.dataset.length = 4;
        dreadnought.dataset.select = '0';
        dreadnought.dataset.orient = 'h';

        this.boardEl.appendChild(dreadnought);
    }

    appendShips () {
        this.appendDreadnought()
    }
    
    boardReactor (type) {
        const board = document.createElement('section');
        
        board.id = `${type}-board`;
        board.classList.add('w-1/3', 'flex', 'flex-col', 'relative');
        
        return board
    }
}