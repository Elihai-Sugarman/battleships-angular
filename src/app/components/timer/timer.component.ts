import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit, OnDestroy {
    time: number = 15;
    isGameOn: boolean = false;
    isGameWon: boolean = false;
    showTimer: boolean = false;
    unsubscribe$ = new Subject<void>();

    constructor(private settingsService: SettingsService) {}

    ngOnInit(): void {
        let timer: any = null;
        this.settingsService.isGameOn$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((value) => (this.isGameOn = value));
        this.settingsService.show$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((value) => {
                if (value) {
                    this.showTimer = false;
                    clearInterval(timer);
                    this.time = 0;
                }
            });
        this.settingsService.timer$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((value) => {
                this.time = value;
                if (this.time === this.settingsService.time) {
                    clearInterval(timer);
                    this.settingsService.isGameOn$.next(false);
                    timer = setInterval(() => {
                        this.settingsService.timer$.next(this.time - 1);
                    }, 1000);
                    this.showTimer = true;
                }
                if (this.time === 0) {
                    clearInterval(timer);
                    this.settingsService.isGameOn$.next(true);
                    this.showTimer = false;
                }
            });
        this.settingsService.isGameWon$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((value) => (this.isGameWon = value));
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
