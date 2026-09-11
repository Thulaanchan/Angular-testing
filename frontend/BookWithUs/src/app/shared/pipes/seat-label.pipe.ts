import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'seatLabel',
  standalone: true
})
export class SeatLabelPipe implements PipeTransform {
  transform(seatCode: string | undefined): string {
    if (!seatCode) return '';
    return seatCode.toUpperCase();
  }
}
