import { Component, ViewChild, ElementRef } from '@angular/core';
import { AttackService } from 'src/app/services/attack.service';

@Component({
  selector: 'app-attack',
  templateUrl: './attack.component.html',
  styleUrls: ['./attack.component.scss']
})
export class AttackComponent {
  cellLetter: string = ''
  cellNumber: string = ''
  @ViewChild('attack') formInput: ElementRef = {} as ElementRef

  constructor(private attatckService: AttackService) { }

  onAttack(): void {
    this.attatckService.onAttack(+this.cellNumber - 1, this.letterToIdx(this.cellLetter.toUpperCase()))
    this.cellLetter = ''
    this.cellNumber = ''
    this.formInput.nativeElement.focus()
  }

  letterToIdx(letter: string): number {
    let idx = 0
    for (let i = letter.length - 1; i >= 0; i--) {
      idx += letter.charCodeAt(i) - 65 + 26 * (letter.length - i - 1)
    }
    return idx
  }
}
