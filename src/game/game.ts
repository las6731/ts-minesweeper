import { Engine, Vector } from 'excalibur';
import { Minesweeper } from './scenes/minesweeper';

export class Game extends Engine {
    gameScene: Minesweeper;

    constructor() {
        super({
            canvasElementId: 'game',
            width: 800,
            height: 800
        });
    }

    public start(): any {
        this.add('minesweeper', new Minesweeper(this, new Vector(25, 25), 150));

        return super.start().then(() => {
            this.goToScene('minesweeper');
        });
    }
}
