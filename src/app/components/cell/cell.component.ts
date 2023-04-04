import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToStringPipe } from 'src/app/pipes/to-string.pipe';
import { AttackService } from 'src/app/services/attack.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent {
  @Input() isGameWon: boolean = false
  isBattleship: boolean = true
  isActive: boolean = false
  isIsland: boolean = false
  @Input() i: number = 0
  @Input() j: number = 0
  @Input() length: number = 0
  @Input() place: number = 0
  @Input() direction: 'horizontal' | 'vertical' | '' = ''
  @Output() onCellClick: EventEmitter<boolean> = new EventEmitter()
  isClicked: boolean = false
  isGameOn: boolean = false

  constructor(private attackService: AttackService, private settingsService: SettingsService, private toStringPipe: ToStringPipe) {
    attackService.coords$.subscribe(({ row, col }) => {
      if (row === this.i && col === this.j) this.onClick()
    })
    settingsService.isGameOn$.subscribe(value => this.isGameOn = value)
    settingsService.board$.subscribe(board => setTimeout(() => {
      if (this.i < board.length && this.j < board[this.i].length) {
        this.isBattleship = board[this.i][this.j].isBattleship
        this.isActive = board[this.i][this.j].isActive
        this.isIsland = board[this.i][this.j].isIsland
      }
    }, 0))
  }

  onClick(): void {
    if (!this.isClicked && this.isGameOn) {
      this.isClicked = true
      this.attackService.setSteps(true)
      if (this.isBattleship) this.onCellClick.emit()
    }
  }

  cellLabel(): string {
    return this.toStringPipe.handleLargeNums(this.j) + (this.i + 1) + ' ' + this.cellTitle()
  }

  cellTitle(): string {
    // if (this.isGameWon) return 'game won'
    if (this.isClicked || !this.isGameOn) {
      if (this.isBattleship) return 'battleship'
      else if (this.isIsland) return 'island'
      return 'empty cell'
    }
    else return 'unexposed cell'
  }
}
