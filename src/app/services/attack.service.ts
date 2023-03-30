import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AttackService {
  coords$ = new BehaviorSubject<any>({})
  steps$ = new Subject

  constructor() { }

  onAttack(row: number, col: number): void {
    this.coords$.next({ row, col })
  }

  setSteps(value: boolean): void {
    this.steps$.next(value)
  }
}
