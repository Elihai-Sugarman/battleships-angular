import { Component } from '@angular/core';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  show: boolean = true
  width: number = window.innerWidth
  time: number = 0
  isGameWon: boolean = false

  constructor(private settingsService: SettingsService) {
    settingsService.show$.subscribe(value => {
      this.show = value
      this.time = 0
    })
    settingsService.timer$.subscribe(value => this.time = value)
    settingsService.isGameWon$.subscribe(value => this.isGameWon = value)
  }

  ngOnInit() {
    addEventListener('resize', () => this.width = window.innerWidth)
  }
}
