import { Component } from '@angular/core';
import { Battleship } from 'src/app/Battleship';
import { BattleshipsService } from 'src/app/services/battleships.service';
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  battleships: Battleship[] = []

  constructor(private battleshipsService: BattleshipsService) {
    // battleshipsService.battleships$.subscribe(value => this.battleships = value)
    battleshipsService.battleships$.asObservable()
      .pipe(map(value => value.sort((a, b) => a.cells.length - b.cells.length)))
      .subscribe(value => this.battleships = value)
  }

  unExposedBattleships(): Battleship[] {
    return this.battleships.filter(battleship => battleship.cells.length !== battleship.exposedCellsCount)
  }

  battleshipsWithLength(length: number): number {
    return this.unExposedBattleships().filter(battleship => battleship.cells.length === length).length
  }

  createArray(length: number): number[] {
    return Array(length).fill(length)
  }

  battleshipLabel(num: number): string {
    return this.battleshipsWithLength(num) + ' battleships with ' + num + ' cells'
  }

}
