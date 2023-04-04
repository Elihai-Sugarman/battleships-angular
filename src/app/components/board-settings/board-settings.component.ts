import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-board-settings',
  templateUrl: './board-settings.component.html',
  styleUrls: ['./board-settings.component.scss']
})
export class BoardSettingsComponent implements AfterViewInit {
  boardLength: number = 10
  boardWidth: number = 10
  battleshipNum: number = 10
  boardType: 'square' | 'rhombus' = 'square'
  createIslands: boolean = false
  minCells: number = this.boardType === 'square' ? 2 : 3
  battleshipNumBorder: number = this.boardType === 'square' ? 2 : 4
  show: boolean = true
  @ViewChild('focus') focusStart: ElementRef = {} as ElementRef
  error: boolean = false

  constructor(private settingService: SettingsService) {
    settingService.show$.subscribe(value => this.show = value)
    settingService.boardType$.subscribe(value => this.boardType = value)
    settingService.boardSettings$.subscribe(({ boardLength, boardWidth, battleshipNum, createIslands }) => {
      this.boardLength = boardLength
      this.boardWidth = boardWidth
      this.battleshipNum = battleshipNum
      this.createIslands = createIslands
    })
  }

  ngAfterViewInit(): void {
    this.focusStart.nativeElement.focus()
  }

  onSubmit(): void {
    this.minCells = this.boardType === 'square' ? 2 : 3
    this.battleshipNumBorder = this.boardType === 'square' ? 2 : 4
    if (!this.boardLength) this.boardLength = 10
    else if (this.boardLength < this.minCells) this.boardLength = this.minCells
    if (!this.boardWidth) this.boardWidth = 10
    else if (this.boardWidth < this.minCells) this.boardWidth = this.minCells
    if (!this.battleshipNum) this.battleshipNum = 10
    if (this.battleshipNum > this.boardLength * this.boardWidth / this.battleshipNumBorder) this.battleshipNum = Math.floor(this.boardLength * this.boardWidth / this.battleshipNumBorder)
    this.settingService.setBoardSettings(this.boardLength, this.boardWidth, this.battleshipNum, this.createIslands)
  }

  onChangeType(type: 'square' | 'rhombus'): void {
    this.boardType = type
    this.settingService.setBoardType(type)
    if (this.boardType === 'rhombus' && (this.boardLength < 3 || this.boardWidth < 3 ||
      this.battleshipNum > this.boardLength * this.boardWidth / 4)) this.onSubmit()
  }

  onCheckIslands(): void {
    this.createIslands = !this.createIslands
    this.onSubmit()
  }

  onSubmitForm(): void {
    if (!this.error) this.settingService.show$.next(false)
    else this.error = false
  }

  handleLastTab(event: Event): void {
    event.preventDefault()
    this.focusStart.nativeElement.focus()
  }

  handleInput(event: any) {
    let value = event.srcElement.value
    if ((value < 2 && this.boardType === 'square') || (value < 3 && this.boardType === 'rhombus')) {
      this.error = true
    } else this.error = false
  }

  handleBattleshipsNum(event: any) {
    let value = event.srcElement.value
    if (value > this.boardLength * this.boardWidth / this.battleshipNumBorder) {
      this.error = true
    } else this.error = false
  }
}
