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
                rowEl.classList.add('row', 'flex', 'flex-row', 'flex-nowrap');
                
                for (let i = 0; i < dims; i++) {
                    const coordEl = document.createElement('div');
                    coordEl.dataset.coor = `${letter}${i + 1}`;
                    coordEl.classList.add('coord', `coord-${this.type}`);
                    coordEl.style.opacity = .3;

                    rowEl.appendChild(coordEl);
                }
                
                rowEls.push(rowEl);
            }
        });

        return rowEls
    }

    appendRows () {
        this.rowEls.forEach(rowEl => this.boardEl.appendChild(rowEl));
    }
    
    boardReactor (type) {
        const board = document.createElement('section');
        
        board.id = `${type}-board`;
        board.classList.add('flex', 'flex-col', 'relative');
        
        return board
    }

    boardInit () {
        this.appendRows();
    }
}