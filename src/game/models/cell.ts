import { Actor, Color, Vector } from 'excalibur';

export class Cell extends Actor {
    static size = 32;

    gridPos: Vector;
    private mine: boolean;
    neighbors: number;
    private flagged: boolean;
    revealed: boolean;

    constructor(pos: Vector, mine: boolean) {
        super(pos.x * Cell.size + Cell.size / 2, pos.y * Cell.size + Cell.size / 2, Cell.size, Cell.size, Color.Gray);

        this.gridPos = pos;
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
        if (!this.flagged) {
            this.revealed = true;
            this.color = Color.LightGray;
            return this.isMine;
        }
        return false;
    }

    /**
     * Toggle whether the cell is flagged.
     */
    toggleFlag(): boolean {
        if (!this.revealed) {
            this.flagged = !this.flagged;
        }
        return this.flagged;
    }

    public onPostDraw(ctx: CanvasRenderingContext2D, delta: number): void {
        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#000000';

        // draw stroke
        ctx.strokeRect(-Cell.size / 2, -Cell.size / 2, Cell.size, Cell.size);

        if (this.revealed) {
            let text = '';
            if (this.neighbors > 0) {
                text = this.neighbors.toString();
            }
            if (this.isMine) {
                text = 'X';
            }

            ctx.fillText(text, 0, 0, Cell.size);
        } else if (this.flagged) {
            ctx.fillText('F', 0, 0, Cell.size);
        }
    }
}
