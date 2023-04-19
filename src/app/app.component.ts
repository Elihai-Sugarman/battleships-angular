import { Component, OnInit } from '@angular/core';
import { SettingsService } from './services/settings.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    show: boolean = true;
    time: number = 0;
    isGameWon: boolean = false;

    constructor(private settingsService: SettingsService) {}

    ngOnInit(): void {
        this.settingsService.show$.subscribe((value) => {
            this.show = value;
            this.time = 0;
        });
        this.settingsService.timer$.subscribe((value) => (this.time = value));
        this.settingsService.isGameWon$.subscribe(
            (value) => (this.isGameWon = value)
        );
    }
}
