export default class Board {
    constructor ({ dims, rows, type }) {
        this.type = type;
        this.boardEl = this.boardReactor();
        this.dims = dims;
        this.rows = rows.toSpliced(dims);
        this.rowEls = this.rowElsReactor();

        this.boardInit();
    }

    appendRows () {
        this.rowEls.forEach(rowEl => this.boardEl.appendChild(rowEl));
    }
    
    boardReactor () {
        const board = document.createElement('section');
        
        board.id = `${this.type}-board`;
        board.classList.add('flex', 'flex-col', 'relative');
        
        return board
    }

    rowElsReactor () {
        let rowEls = []; 
    
        this.rows.forEach((letter) => {
            const rowEl = document.createElement('div');
            rowEl.dataset.row = letter;
            rowEl.classList.add('row', 'flex', 'flex-row', 'flex-nowrap');
            
            for (let i = 0; i < this.dims; i++) {
                const coordEl = document.createElement('div');
                coordEl.dataset.coor = `${letter}${i + 1}`;
                coordEl.dataset.state = 'free';
                coordEl.classList.add('coord', `coord-${this.type}`);
                coordEl.style.opacity = .3

                rowEl.appendChild(coordEl);
            }
            
            rowEls.push(rowEl);
        });

        return rowEls
    }

    boardInit () {
        this.appendRows();
    }
}