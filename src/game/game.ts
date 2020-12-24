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
        this.gameScene = new Minesweeper(this, new Vector(25, 25), 100);
        this.add('minesweeper', this.gameScene);

        return super.start().then(() => {
            this.goToScene('minesweeper');
        });
    }
}
