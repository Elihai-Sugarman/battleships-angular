import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { Battleship } from '../Battleship';

@Injectable({
  providedIn: 'root'
})
export class BattleshipsService {
  battleships$ = new BehaviorSubject<Battleship[]>([])

  constructor() { }

  setBattleships(battleships: Battleship[]): void {
    this.battleships$.next(battleships)
  }
}
