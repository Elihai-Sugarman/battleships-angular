import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CellComponent } from './components/cell/cell.component';
import { BoardComponent } from './components/board/board.component';
import { ToStringPipe } from './pipes/to-string.pipe';
import { FormsModule } from '@angular/forms';
import { BoardSettingsComponent } from './components/board-settings/board-settings.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AttackComponent } from './components/attack/attack.component';
import { GameSummeryComponent } from './components/game-summery/game-summery.component';
import { TimerComponent } from './components/timer/timer.component';

@NgModule({
  declarations: [
    AppComponent,
    CellComponent,
    BoardComponent,
    ToStringPipe,
    BoardSettingsComponent,
    DashboardComponent,
    AttackComponent,
    GameSummeryComponent,
    TimerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [ToStringPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
