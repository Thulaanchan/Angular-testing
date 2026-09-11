import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slotCode',
  standalone: true
})
export class SlotCodePipe implements PipeTransform {
  transform(code: string | undefined): string {
    if (!code) return '';
    return code.toUpperCase();
  }
}
