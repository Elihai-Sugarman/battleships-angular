import { Component, OnDestroy, OnInit } from '@angular/core';
import { IBattleship } from 'src/app/components/board/battleship.interface';
import { BattleshipsService } from 'src/app/services/battleships.service';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
    battleships: IBattleship[] = [];
    unsubscribe$ = new Subject<void>();

    constructor(private battleshipsService: BattleshipsService) {}

    ngOnInit(): void {
        this.battleshipsService.battleships$
            .asObservable()
            .pipe(
                takeUntil(this.unsubscribe$),
                map((value) =>
                    value.sort((a, b) => a.cells.length - b.cells.length)
                )
            )
            .subscribe((value) => (this.battleships = value));
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    unExposedBattleships(): IBattleship[] {
        return this.battleships.filter(
            (battleship) =>
                battleship.cells.length !== battleship.exposedCellsCount
        );
    }

    battleshipsWithLength(length: number): number {
        return this.unExposedBattleships().filter(
            (battleship) => battleship.cells.length === length
        ).length;
    }

    createArray(length: number): number[] {
        return Array(length).fill(length);
    }

    battleshipLabel(num: number): string {
        return (
            this.battleshipsWithLength(num) +
            ' battleships with ' +
            num +
            ' cells'
        );
    }
}
