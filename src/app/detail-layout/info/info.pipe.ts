import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'info',
  standalone: true
})
export class InfoPipe implements PipeTransform {

   
  transform(items: any[], criteria: any): any[] {
    if (!items) return [];
    if (!criteria) return items;

    const { InspectionDate, TotalVehicleViolations, VIN , UnitLicenseState, TotalViolations} = criteria;


    return items.filter(item => {
      const matchesInspectionDate = InspectionDate ? this.dateMatches(item.InspectionDate, InspectionDate) : true;
      const matchesTotalVehicleViolations = TotalVehicleViolations ? (item.TotalVehicleViolations ? item.TotalVehicleViolations.toString().includes(TotalVehicleViolations.toString()) : false) : true;

      const matchesVIN = VIN ? (item.VIN ? item.VIN.toLowerCase().includes(VIN.toLowerCase()) : false) : true;
      const matcheTotalViolations = TotalViolations ? (item.TotalViolations ? item.TotalViolations.toString().toLowerCase().includes(TotalViolations.toString().toLowerCase()): false) :true;
      const matchesUnitLicenseState = UnitLicenseState ? (item.UnitLicenseState ? item.UnitLicenseState.toLowerCase().includes(UnitLicenseState.toLowerCase()) : false) : true;
      const result = matchesInspectionDate && matchesTotalVehicleViolations && matchesVIN && matchesUnitLicenseState && matcheTotalViolations;

     
      return result;
    });
  }

  private dateMatches(itemDate: string, criteriaDate: string): boolean {
    if (!itemDate || !criteriaDate) return false;

    const itemDateParsed = this.parseDate(itemDate);
    const criteriaDateParsed = this.parseDate(criteriaDate);

    if (!itemDateParsed || !criteriaDateParsed) {
      console.warn(`Invalid dates: Item Date - ${itemDateParsed}, Criteria Date - ${criteriaDateParsed}`);
      return false;
    }

  
    return itemDateParsed.toDateString() === criteriaDateParsed.toDateString();
  }

  private parseDate(dateInput: string | number): Date | null {
    // If it's a number like 20250219, convert to string
    let dateString = typeof dateInput === 'number' ? dateInput.toString() : dateInput;
  
    // Handle yyyyMMdd format (e.g., 20250219)
    if (/^\d{8}$/.test(dateString)) {
      const year = parseInt(dateString.substring(0, 4), 10);
      const month = parseInt(dateString.substring(4, 6), 10);
      const day = parseInt(dateString.substring(6, 8), 10);
      const parsedDate = new Date(year, month - 1, day); // month is 0-based
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
  
    // Handle ISO format (yyyy-MM-dd)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const parsedDate = new Date(dateString);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
  
    // Handle MM-dd-yyyy format
    const dashParts = dateString.split('-');
    if (dashParts.length === 3) {
      const [month, day, year] = dashParts.map(part => parseInt(part, 10));
      const parsedDate = new Date(year, month - 1, day);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
  
    // Handle MM/dd/yyyy format
    const slashParts = dateString.split('/');
    if (slashParts.length === 3) {
      const [month, day, year] = slashParts.map(part => parseInt(part, 10));
      const parsedDate = new Date(year, month - 1, day);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
  
    console.warn(`Invalid date format: ${dateString}`);
    return null;
  }
  

}
