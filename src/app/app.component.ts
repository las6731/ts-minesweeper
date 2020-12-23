import { Component, OnInit } from '@angular/core';
import { Game } from 'src/game/game';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    game: Game;

    ngOnInit(): void {
        this.game = new Game();
    }

}
