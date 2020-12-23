import { randomInt } from 'crypto';
import { Engine, Scene, Vector } from 'excalibur';
import { Cell } from '../models/cell';

export class Minesweeper extends Scene {
    size: Vector;
    numMines: number;
    totalMines: number;
    gameGrid: Cell[][];

    /**
     * Initialize the Minesweeper game.
     * @param engine the Engine.
     * @param size the size of the game grid.
     * @param mines the number of mines that should be placed.
     */
    constructor(engine: Engine, size: Vector, mines: number) {
        super(engine);

        this.size = size;
        this.numMines = 0;
        this.totalMines = mines;

        this.populateGrid();
    }

    /**
     * Populate cells into the grid.
     */
    private populateGrid(): void {
        // place mines
        while (this.numMines < this.totalMines) {
            const x = randomInt(this.size.x);
            const y = randomInt(this.size.y);

            // if there's already a mine there, do nothing
            if (this.gameGrid[x][y]) {
                continue;
            }

            this.gameGrid[x][y] = new Cell(new Vector(x, y), true);
            this.numMines++;
        }

        // fill in the rest of the grid
        for (let x = 0; x < this.size.x; x++) {
            for (let y = 0; y < this.size.y; y++) {
                if (!this.gameGrid[x][y]) { // no mine has been placed yet
                    this.gameGrid[x][y] = new Cell(new Vector(x, y), false);
                }
            }
        }
    }

    /**
     * Calculate number of mines in cells neighboring the position in the grid.
     * @param pos the position to calculate neighbors for.
     */
    private calculateNeighbors(pos: Vector): number {
        let neighbors = 0;

        for (let x = Math.max(0, pos.x - 1); x < Math.min(this.size.x, pos.x + 1); x++) {
            for (let y = Math.max(0, pos.y - 1); y < Math.min(this.size.y, pos.y + 1); y++) {
                if (this.gameGrid[x][y].isMine) {
                    neighbors++;
                }
            }
        }

        return neighbors;
    }

    /**
     * Calculate neighbors for all positions of the grid.
     */
    private populateNeighbors(): void {
        for (let x = 0; x < this.size.x; x++) {
            for (let y = 0; y < this.size.y; y++) {
                this.gameGrid[x][y].neighbors = this.calculateNeighbors(new Vector(x, y));
            }
        }
    }
}
