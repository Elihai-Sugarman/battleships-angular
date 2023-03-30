import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent {
  time: number = 15
  isGameOn: boolean = false
  timer!: any
  isGameWon: boolean = false
  showTimer: boolean = false

  constructor(private settingsService: SettingsService) {
    settingsService.isGameOn$.subscribe(value => this.isGameOn = value)
    settingsService.show$.subscribe(value => {
      if (value) {
        this.showTimer = false
        clearInterval(this.timer)
        this.time = 0
      }
    })
    settingsService.timer$.subscribe(value => {
      this.time = value
      if (this.time === settingsService.time) {
        clearInterval(this.timer)
        settingsService.isGameOn$.next(false)
        this.timer = setInterval(() => {
          this.settingsService.timer$.next(this.time - 1)
        }, 1000)
        this.showTimer = true
      }
      if (this.time === 0) {
        clearInterval(this.timer)
        settingsService.isGameOn$.next(true)
        this.showTimer = false
      }
    })
    settingsService.isGameWon$.subscribe(value => this.isGameWon = value)
  }
}
