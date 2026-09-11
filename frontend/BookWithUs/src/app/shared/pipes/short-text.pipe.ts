import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortText',
  standalone: true
})
export class ShortTextPipe implements PipeTransform {
  transform(text: string | undefined, limit = 100, trail = '...'): string {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + trail : text;
  }
}
