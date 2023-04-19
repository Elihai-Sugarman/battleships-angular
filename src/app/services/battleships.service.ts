import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IBattleship } from '../components/board/battleship.interface';

@Injectable({
    providedIn: 'root',
})
export class BattleshipsService {
    battleships$ = new BehaviorSubject<IBattleship[]>([]);

    constructor() {}

    setBattleships(battleships: IBattleship[]): void {
        this.battleships$.next(battleships);
    }
}
