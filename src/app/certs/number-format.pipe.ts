import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat',
  standalone: true
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: string): string {
    return value ? value.replace('$', '') : value;
  }


}
