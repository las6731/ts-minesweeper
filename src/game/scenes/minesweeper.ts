import { Engine, Scene, Vector } from 'excalibur';
import { KeyEvent, Keys } from 'excalibur/dist/Input/Index';
import { PointerUpEvent } from 'excalibur/dist/Input/PointerEvents';
import { Cell } from '../models/cell';

export class Minesweeper extends Scene {
    game: Engine;
    size: Vector;
    numMines: number;
    totalMines: number;
    gameGrid: Cell[][];
    started: boolean;

    /**
     * Initialize the Minesweeper game.
     * @param engine the Engine.
     * @param size the size of the game grid.
     * @param mines the number of mines that should be placed.
     */
    constructor(engine: Engine, size: Vector, mines: number) {
        super(engine);

        this.game = engine;
        this.size = size;
        this.numMines = 0;
        this.totalMines = mines;
        this.started = false;

        this.gameGrid = [];
        for (let x = 0; x < size.x; x++) {
            this.gameGrid[x] = [];
            const row = this.gameGrid[x];
            for (let y = 0; y < size.y; y++) {
                row[y] = new Cell(new Vector(x, y), false);
                this.add(row[y]);
            }
        }

        this.revealCell = this.revealCell.bind(this);
        this.flagCell = this.flagCell.bind(this);

        engine.input.pointers.primary.on('up', this.revealCell);
        engine.input.keyboard.on('release', this.flagCell);
    }

    revealCell(event: PointerUpEvent): void {
        const pos = event.worldPos;
        const gridPos = new Vector(Math.floor(pos.x / Cell.size), Math.floor(pos.y / Cell.size));

        if (!this.started) {
            this.populateGrid(gridPos);
            this.populateNeighbors();
            this.revealNeighbors(gridPos);

            this.started = true;
        }

        const cell = this.gameGrid[gridPos.x][gridPos.y];
        if (cell.reveal()) {
            console.log('You lost, loser!');
        } else if (cell.neighbors === 0) {
            this.revealNeighbors(cell.gridPos);
        }
    }

    revealNeighbors(pos: Vector): void {
        for (let x = Math.max(0, pos.x - 1); x < Math.min(this.size.x, pos.x + 2); x++) {
            for (let y = Math.max(0, pos.y - 1); y < Math.min(this.size.y, pos.y + 2); y++) {
                if (x === pos.x && y === pos.y) {
                    continue;
                }
                const cell = this.gameGrid[x][y];
                if (!cell.isMine && !cell.revealed) {
                    cell.reveal();
                    if (cell.neighbors === 0) {
                        this.revealNeighbors(cell.gridPos);
                    }
                }
            }
        }
    }

    flagCell(event: KeyEvent): void {
        if (event.key === 70) {
            const mousePos = this.game.input.pointers.primary.lastWorldPos;
            const gridPos = new Vector(Math.floor(mousePos.x / Cell.size), Math.floor(mousePos.y / Cell.size));

            this.gameGrid[gridPos.x][gridPos.y].toggleFlag();
        }
    }

    /**
     * Return a random integer between 0 (inclusive) and the ceiling (non-inclusive).
     * @param ceiling max number (non-inclusive).
     */
    private randomInt(ceiling: number): number {
        return Math.floor(Math.random() * Math.floor(ceiling));
    }

    /**
     * Populate cells into the grid.
     */
    private populateGrid(startPos: Vector): void {
        // init grid
        this.gameGrid = [];
        for (let x = 0; x < this.size.x; x++) {
            this.gameGrid[x] = [];
            const row = this.gameGrid[x];
            for (let y = 0; y < this.size.y; y++) {
                row[y] = null;
            }
        }

        // place mines
        while (this.numMines < this.totalMines) {
            const x = this.randomInt(this.size.x);
            const y = this.randomInt(this.size.y);

            // if there's already a mine there, do nothing
            if (this.gameGrid[x][y]) {
                continue;
            }

            const distance = Math.abs(x - startPos.x) + Math.abs(y - startPos.y);
            if (distance < 3) {
                continue;
            }

            this.gameGrid[x][y] = new Cell(new Vector(x, y), true);
            this.numMines++;
            console.log(`Mine placed! ${this.numMines}/${this.totalMines}`, x, y);
        }

        // fill in the rest of the grid
        for (let x = 0; x < this.size.x; x++) {
            for (let y = 0; y < this.size.y; y++) {
                if (!this.gameGrid[x][y]) { // no mine has been placed yet
                    this.gameGrid[x][y] = new Cell(new Vector(x, y), false);
                    console.log('Blank cell placed!', x, y);
                }
                this.add(this.gameGrid[x][y]); // add cell to scene
            }
        }
    }

    /**
     * Calculate number of mines in cells neighboring the position in the grid.
     * @param pos the position to calculate neighbors for.
     */
    private calculateNeighbors(pos: Vector): number {
        let neighbors = 0;

        for (let x = Math.max(0, pos.x - 1); x < Math.min(this.size.x, pos.x + 2); x++) {
            for (let y = Math.max(0, pos.y - 1); y < Math.min(this.size.y, pos.y + 2); y++) {
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
