import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ICell } from '../components/board/cell.interface';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    boardType$ = new BehaviorSubject<'square' | 'rhombus'>('square');
    createIslands$ = new BehaviorSubject<boolean>(false);
    boardSettings$ = new BehaviorSubject<any>({
        boardLength: 10,
        boardWidth: 10,
        battleshipNum: 10,
        createIslands: false,
    });
    isGameWon$ = new Subject<boolean>();
    isGameOn$ = new Subject<boolean>();
    timer$ = new Subject<number>();
    board$ = new BehaviorSubject<ICell[][]>([]);
    time: number = 15;
    show$ = new BehaviorSubject<boolean>(true);

    constructor() {}

    setBoardType(type: 'square' | 'rhombus'): void {
        this.boardType$.next(type);
    }

    setCreateIslands(createIslands: boolean): void {
        this.createIslands$.next(createIslands);
    }

    setBoardSettings(
        boardLength: number,
        boardWidth: number,
        battleshipNum: number,
        createIslands: boolean
    ): void {
        this.boardSettings$.next({
            boardLength,
            boardWidth,
            battleshipNum,
            createIslands,
        });
    }

    setTimer(): void {
        this.timer$.next(this.time);
    }
}
