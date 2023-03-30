import { Component, OnInit, ViewChild } from '@angular/core';
import { Battleship } from 'src/app/Battleship';
import { Cell } from 'src/app/Cell';
import { AttackService } from 'src/app/services/attack.service';
import { BattleshipsService } from 'src/app/services/battleships.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  boardLength: number = 10
  boardWidth: number = 10
  board: Cell[][] = []
  battleshipNum: number = 10
  battleshipCount: number = 0
  battleshipCellsCount: number = 0
  isGameWon: boolean = false
  battleships: Battleship[] = []
  boardType: 'square' | 'rhombus' = 'square'
  createIslands: boolean = false
  isGameOn: boolean = false

  constructor(private settingService: SettingsService, private battleshipsService: BattleshipsService, private attackService: AttackService) {
    settingService.boardType$.subscribe(value => {
      this.boardType = value
      this.ngOnInit()
    })
    settingService.boardSettings$.subscribe(({ boardLength, boardWidth, battleshipNum, createIslands }) => {
      this.boardLength = boardLength
      this.boardWidth = boardWidth
      this.battleshipNum = battleshipNum
      this.createIslands = createIslands
      this.ngOnInit()
    })
    settingService.isGameOn$.subscribe(value => this.isGameOn = value)
    settingService.show$.subscribe(value => {
      if (!value) this.startGame()
    })
  }

  ngOnInit() {
    this.battleshipCount = 0
    this.board = []
    this.battleships = []
    this.isGameWon = false
    this.settingService.isGameWon$.next(false)
    this.attackService.setSteps(false)
    this.setBoard()
    this.settingService.board$.next(this.board)
  }

  startGame(): void {
    this.setBoard()
    if (this.createIslands) this.setIslands()
    this.setBattleships()
    this.settingService.board$.next(this.board)
    this.settingService.setTimer()
  }

  setBoard(): void {
    this.board = []
    if (this.boardType === 'square') {
      for (let i = 0; i < this.boardLength; i++) {
        this.board.push(Array(this.boardWidth).fill({ isBattleship: false, leftBorder: false, rightBorder: false, topBorder: false, bottomBorder: false, isActive: true, isIsland: false, battleshipLength: 0 }))
      }
    } else if (this.boardType === 'rhombus') {
      if (this.boardWidth < 3) this.boardWidth = 3
      if (this.boardLength < 3) this.boardLength = 3
      for (let i = 0; i < this.boardLength; i++) {
        let boardLine: Cell[] = []
        for (let j = 0; j < this.boardWidth; j++) {
          let isActive: boolean = Math.floor(this.boardLength / 2) === i || Math.floor(this.boardWidth / 2) === j ||
            (this.boardLength % 2 === 0 && this.boardLength / 2 - 1 === i) || (this.boardWidth % 2 === 0 && this.boardWidth / 2 - 1 === j)
          boardLine.push({ isBattleship: false, leftBorder: false, rightBorder: false, topBorder: false, bottomBorder: false, isActive, isIsland: false, battleshipLength: 0, place: 0, direction: '' })
        }
        this.board.push(boardLine)
      }
      let longer: number = this.boardLength > this.boardWidth ? this.boardLength : this.boardWidth
      let shorter: number = this.boardLength > this.boardWidth ? this.boardWidth : this.boardLength
      let cellsNum: number = Math.floor(longer / 2)
      let cellsGap: number = Math.floor((longer - shorter) / (Math.floor(shorter / 2)))
      if (longer === shorter) cellsGap += 1
      else if (cellsGap === 0) cellsGap = 1
      cellsNum += Math.floor((longer - shorter) / (Math.floor(shorter / 2)))
      if (longer !== shorter) cellsNum -= cellsGap
      while (cellsGap - (cellsNum - cellsGap * (Math.floor(shorter / 2) - 1)) > 1) cellsGap--
      let gaps = Array(Math.floor(shorter / 2) - 1).fill(cellsGap)
      for (let j = 1; j <= cellsNum - cellsGap * (Math.floor(shorter / 2)); j++) gaps[j]++
      for (let j = 1; j <= cellsGap * (Math.floor(shorter / 2)) - cellsNum; j++) gaps[j]--
      let edge = (this.boardLength % 2 === 0 && (this.boardLength <= 6 || this.boardWidth % 2 === 0)) ? 2 : 1
      for (let i = 1; i <= Math.ceil(shorter / 2) - edge; i++) {
        cellsNum -= gaps[i - 1]
        for (let k = 1; k <= cellsNum; k++) {
          let addToRow = longer === this.boardWidth ? i : k
          let addToCol = longer === this.boardWidth ? k : i
          if (this.boardWidth % 2 === 0) {
            if (Math.abs(this.boardLength - this.boardWidth) !== 1) addToCol--
            this.board[Math.floor(this.boardLength / 2) + addToRow][Math.floor(this.boardWidth / 2) - addToCol - 1].isActive = true
            this.board[Math.floor(this.boardLength / 2) - addToRow][Math.floor(this.boardWidth / 2) - addToCol - 1].isActive = true
          }
          if (this.boardLength % 2 === 0) {
            if (Math.abs(this.boardLength - this.boardWidth) !== 1 && this.boardWidth % 2 !== 0) addToRow--
            this.board[Math.floor(this.boardLength / 2) - addToRow - 1][Math.floor(this.boardWidth / 2) + addToCol].isActive = true
            this.board[Math.floor(this.boardLength / 2) - addToRow - 1][Math.floor(this.boardWidth / 2) - addToCol].isActive = true
          }
          if (this.boardLength % 2 === 0 && 0 === this.boardWidth % 2) {
            this.board[Math.floor(this.boardLength / 2) - addToRow - 1][Math.floor(this.boardWidth / 2) - addToCol - 1].isActive = true
          }
          this.board[Math.floor(this.boardLength / 2) - addToRow][Math.floor(this.boardWidth / 2) + addToCol].isActive = true
          this.board[Math.floor(this.boardLength / 2) + addToRow][Math.floor(this.boardWidth / 2) - addToCol].isActive = true
          this.board[Math.floor(this.boardLength / 2) + addToRow][Math.floor(this.boardWidth / 2) + addToCol].isActive = true
          this.board[Math.floor(this.boardLength / 2) - addToRow][Math.floor(this.boardWidth / 2) - addToCol].isActive = true
        }
      }
    }
  }

  setIslands(): void {
    for (let k = 0; k < Math.floor(this.boardLength * this.boardWidth / 10); k++) {
      let i = 0, j = 0;
      let checkPosition = false
      while (!checkPosition) {
        checkPosition = true
        i = this.getRandomInt(0, this.boardLength)
        j = this.getRandomInt(0, this.boardWidth)
        if (!this.board[i][j].isActive || this.board[i][j].isIsland) checkPosition = false
      }
      this.board[i][j] = { ...this.board[i][j], isIsland: true }
    }
  }

  setBattleships(): void {
    this.battleshipCellsCount = 0
    for (let k = this.battleshipNum; k >= 1; k--) {
      let direction: 'vertical' | 'horizontal' = Math.random() > 0.5 ? 'horizontal' : 'vertical'
      let length = this.boardType === 'rhombus' ?
        this.getRandomInt(1, Math.min(5, Math.ceil(this.boardLength * 0.9 / (this.battleshipNum ** 0.5)), Math.ceil(this.boardWidth * 0.9 / (this.battleshipNum ** 0.5)))) :
        this.getRandomInt(1, Math.min(5, this.boardLength * this.boardWidth * 0.9 / this.battleshipNum))
      let i = 0, j = 0
      let checkPosition = false
      while (!checkPosition) {
        checkPosition = true
        i = this.getRandomInt(0, this.boardLength)
        j = this.getRandomInt(0, this.boardWidth)
        for (let l = 0; l < length; l++) {
          if (direction === 'horizontal' && (j + l >= this.boardWidth || (length + i > this.boardLength) || !this.board[i][j + l].isActive || this.board[i][j + l].isBattleship || this.board[i][j + l].isIsland)) checkPosition = false
          else if (direction === 'vertical' && (i + l >= this.boardLength || (length + j > this.boardWidth) || !this.board[i + l][j].isActive || this.board[i + l][j].isBattleship || this.board[i + l][j].isIsland)) checkPosition = false
        }
      }
      let battleship = []
      for (let m = 0; m < length; m++) {
        let leftBorder = false, rightBorder = false, topBorder = false, bottomBorder = false
        if (direction === 'horizontal') {
          if (m === 0) leftBorder = true
          if (m === length - 1) rightBorder = true
          topBorder = true
          bottomBorder = true
          this.board[i][j + m] = { isBattleship: true, leftBorder, rightBorder, topBorder, bottomBorder, isActive: true, isIsland: false, battleshipLength: length, place: m + 1, direction }
          battleship.push([i, j + m])
        } else if (direction === 'vertical') {
          if (m === 0) topBorder = true
          if (m === length - 1) bottomBorder = true
          leftBorder = true
          rightBorder = true
          this.board[i + m][j] = { isBattleship: true, leftBorder, rightBorder, topBorder, bottomBorder, isActive: true, isIsland: false, battleshipLength: length, place: m + 1, direction }
          battleship.push([i + m, j])
        }
        this.battleshipCellsCount++
      }
      this.battleships.push({ cells: battleship, exposedCellsCount: 0, direction })
    }
    this.battleshipsService.setBattleships(this.battleships)
  }

  onCellClick(row: number, col: number): void {
    this.battleshipCount++
    for (let battleship of this.battleships) {
      for (let [i, j] of battleship.cells) {
        if (i === row && j === col) battleship.exposedCellsCount++
      }
    }
    if (this.battleshipCount === this.battleshipCellsCount) {
      this.isGameWon = true
      this.settingService.isGameWon$.next(true)
      this.settingService.isGameOn$.next(false)
    }
  }

  restart(): void {
    this.settingService.show$.next(true)
    this.ngOnInit()
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min)
  }

}
