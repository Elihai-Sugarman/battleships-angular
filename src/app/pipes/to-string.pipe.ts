import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'toString',
})
export class ToStringPipe implements PipeTransform {
    transform(value: number): string {
        return this.handleLargeNums(value);
    }

    handleLargeNums(value: number): string {
        if (value <= 25) return String.fromCharCode(65 + value);
        return (
            this.handleLargeNums(Math.floor(value / 26) - 1) +
            String.fromCharCode(65 + Math.floor(value % 26))
        );
    }
}
