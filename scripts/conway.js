export class Conway {

    constructor(columns, rows) {
        this.generations = [this.createArray(columns, rows)]
        this.columns = columns
        this.boundary = false
        this.shadow = false
        this.paused = true
        this.fire = false
        this.rows = rows
    }

    createArray(columns, rows) {
        return new Array(columns).fill(0).map(() => new Array(rows).fill(0))
    }
    
    random() {
        for (let column = 0; column < this.columns; column++) {
            for (let row = 0; row < this.rows; row++) {
                this.generations[0][column][row] = Math.round(Math.random())
            }
        }
    }

    clear() {
        this.generations = [this.createArray(this.columns, this.rows)]
    }

    pause() {
        this.paused = true
    }
    
    count(column, row) {

        let counter = 0

        for (let offsetX = -1; offsetX < 2; offsetX++) {
            for (let offsetY = -1; offsetY < 2; offsetY++) {
                if (!this.boundary || this.generations[0][column + offsetX]?.[row + offsetY]) {
                    const otherColumn = (offsetX + column + this.columns) % this.columns
                    const otherRow = (offsetY + row + this.rows) % this.rows
                    counter += this.generations[0][otherColumn][otherRow]
                }
            }
        }

        counter -= this.generations[0][column][row]
        return counter

    }

    generate(generations) {

        for (let generation = 0; generation < generations; generation++) {

            const current = this.generations[0]
            const next = this.createArray(this.columns, this.rows)

            for (let column = 0; column < this.columns; column++) {
                for (let row = 0; row < this.rows; row++) {
                    const neighbors = this.count(column, row)
                    const state = current[column][row]
                    if (!state && neighbors == 3) {
                        next[column][row] = 1
                    } else if (state && (neighbors < 2 || neighbors > 3)) {
                        next[column][row] = 0
                    } else {
                        next[column][row] = state
                    }
                }
            }

            this.generations.unshift(next)

            if (this.generations.length == 6)
                this.generations.pop()
        
        }

    }

}