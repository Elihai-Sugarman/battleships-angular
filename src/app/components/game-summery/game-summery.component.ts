import { Component, OnInit } from '@angular/core';
import { AttackService } from 'src/app/services/attack.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-game-summery',
  templateUrl: './game-summery.component.html',
  styleUrls: ['./game-summery.component.scss']
})
export class GameSummeryComponent {
  games: any[] = []
  steps: number = 0
  boardLength: number = 10
  boardWidth: number = 10
  battleshipNum: number = 10
  createIslands: boolean = false
  show: boolean = true
  elementsToRead: any[] = []

  constructor(private attackService: AttackService, private settingService: SettingsService) {
    settingService.boardSettings$.subscribe(({ boardLength, boardWidth, battleshipNum, createIslands }) => {
      this.boardLength = boardLength
      this.boardWidth = boardWidth
      this.battleshipNum = battleshipNum
      this.createIslands = createIslands
    })
    settingService.isGameWon$.subscribe(value => {
      if (value) this.games.push({ boardLength: this.boardLength, boardWidth: this.boardWidth, battleshipNum: this.battleshipNum, createIslands: this.createIslands, steps: this.steps })
    })
    attackService.steps$.subscribe(value => {
      if (value) this.steps++
      else this.steps = 0
    })
  }

  clearList(): void {
    this.games = []
  }

}
