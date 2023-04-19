import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AttackService } from 'src/app/services/attack.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
    selector: 'app-game-summery',
    templateUrl: './game-summery.component.html',
    styleUrls: ['./game-summery.component.scss'],
})
export class GameSummeryComponent implements OnInit, OnDestroy {
    games: any[] = [];
    steps: number = 0;
    boardLength: number = 10;
    boardWidth: number = 10;
    battleshipNum: number = 10;
    createIslands: boolean = false;
    show: boolean = true;
    elementsToRead: any[] = [];
    unsubscribe$ = new Subject<void>();

    constructor(
        private attackService: AttackService,
        private settingService: SettingsService
    ) {}

    ngOnInit(): void {
        this.settingService.boardSettings$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                ({ boardLength, boardWidth, battleshipNum, createIslands }) => {
                    this.boardLength = boardLength;
                    this.boardWidth = boardWidth;
                    this.battleshipNum = battleshipNum;
                    this.createIslands = createIslands;
                }
            );
        this.settingService.isGameWon$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((value) => {
                if (value)
                    this.games.push({
                        boardLength: this.boardLength,
                        boardWidth: this.boardWidth,
                        battleshipNum: this.battleshipNum,
                        createIslands: this.createIslands,
                        steps: this.steps,
                    });
            });
        this.attackService.steps$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((value) => {
                if (value) this.steps++;
                else this.steps = 0;
            });
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    clearList(): void {
        this.games = [];
    }
}
