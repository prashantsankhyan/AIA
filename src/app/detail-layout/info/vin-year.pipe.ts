import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vinYear',
  standalone: true
})
export class VinYearPipe implements PipeTransform {

   private vinYearMap: { [key: string]: number } = {
    A: 2010, B: 2011, C: 2012, D: 2013, E: 2014,
    F: 2015, G: 2016, H: 2017, J: 2018, K: 2019,
    L: 2020, M: 2021, N: 2022, P: 2023, R: 2024,
    S: 2025, T: 2026, V: 2027
  };

  transform(vin: string | null | undefined): string {
    if (!vin || vin.length < 10) return 'Invalid VIN';

    const yearChar = vin[9].toUpperCase(); // 10th character (0-based index = 9)
    const year = this.vinYearMap[yearChar];

    return year ? year.toString() : 'Unknown Year';
  }

}
