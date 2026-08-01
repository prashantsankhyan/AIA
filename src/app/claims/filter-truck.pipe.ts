import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTruck',
  standalone: true,

})
export class FilterTruckPipe implements PipeTransform {

  transform(trucks: any[], searchText: string): any[] {
    
    if (!trucks || !searchText) return trucks;

    const lowerSearch = searchText.toLowerCase();
    return trucks.filter(truck =>
      truck.BodyType !== 'Trailer' && (
        truck.VIN?.toLowerCase().includes(lowerSearch) ||
        truck.VehicleType?.toLowerCase().includes(lowerSearch) ||
        truck.Model?.toLowerCase().includes(lowerSearch)
      )
    );
  }
  

}
