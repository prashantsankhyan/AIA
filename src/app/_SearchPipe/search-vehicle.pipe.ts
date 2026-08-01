import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchVehicle',
  standalone: true
})
export class SearchVehiclePipe implements PipeTransform {

   
  transform(items: any[], criteria: any): any[] {
    if (!items) return [];
    if (!criteria) return items;

    const { DateofBirth, Year, VIN , BodyType, Model} = criteria;


    return items.filter(item => {
      const matchesDateofBirth = DateofBirth ? this.dateMatches(item.DateofBirth, DateofBirth) : true;
      const matchesYear = Year ? (item.Year ? item.Year.toString().includes(Year.toString()) : false) : true;

      const matchesVIN = VIN ? (item.VIN ? item.VIN.toLowerCase().includes(VIN.toLowerCase()) : false) : true;
      const matchesModel = Model ? (item.Model ? item.Model.toString().toLowerCase().includes(Model.toString().toLowerCase()): false) :true;
      const matchesBodyType = BodyType ? (item.BodyType ? item.BodyType.toLowerCase().includes(BodyType.toLowerCase()) : false) : true;
      const result = matchesDateofBirth && matchesYear && matchesVIN && matchesBodyType && matchesModel;

     
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

  private parseDate(dateString: string): Date | null {
    // Remove the time component if present
    dateString = dateString.split('T')[0];

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
      const parsedDate = new Date(year, month - 1, day); // month is 0-based
      if (parsedDate.getFullYear() === year && parsedDate.getMonth() === month - 1 && parsedDate.getDate() === day) {
        console.log(`Parsed date (MM-dd-yyyy format): ${parsedDate.toISOString()}`);
        return parsedDate;
      }
    }

    // Handle MM/dd/yyyy format
    const slashParts = dateString.split('/');
    if (slashParts.length === 3) {
      const [month, day, year] = slashParts.map(part => parseInt(part, 10));
      const parsedDate = new Date(year, month - 1, day); // month is 0-based
      if (parsedDate.getFullYear() === year && parsedDate.getMonth() === month - 1 && parsedDate.getDate() === day) {
        console.log(`Parsed date (MM/dd/yyyy format): ${parsedDate.toISOString()}`);
        return parsedDate;
      }
    }

    // Return null if parsing fails
    console.warn(`Invalid date format: ${dateString}`);
    return null;
  }

}
