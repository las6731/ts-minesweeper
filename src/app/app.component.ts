import { Component, OnInit } from '@angular/core';
import * as ex from 'excalibur';
import { Engine } from 'excalibur';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    engine: Engine;

    ngOnInit(): void {
        this.engine = new ex.Engine({
            canvasElementId: 'game',
            width: 800,
            height: 800
        });

        this.engine.start();
    }

}
