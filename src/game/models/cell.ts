import { Actor, Vector } from 'excalibur';

export class Cell extends Actor {
    private mine: boolean;
    neighbors: number;
    private flagged: boolean;
    private revealed: boolean;

    constructor(pos: Vector, mine: boolean) {
        super();

        this.pos = pos;
        this.mine = mine;
        this.neighbors = 0;
        this.flagged = false;
        this.revealed = false;
    }

    get isMine(): boolean { return this.mine; }

    /**
     * Reveal the cell.
     * @returns whether the cell was a mine.
     */
    reveal(): boolean {
        this.revealed = true;
        return this.isMine;
    }

    /**
     * Toggle whether the cell is flagged.
     */
    toggleFlag(): void {
        this.flagged = !this.flagged;
    }
}
