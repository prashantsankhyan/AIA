import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'srachSaleAttachemnt',
  standalone: true
})
export class SrachSaleAttachemntPipe implements PipeTransform {

  transform(items: any[], criteria: any): any[] {
    if (!items) return [];
    if (!criteria) return items;

    const { AttachmentDate, Description, EnteredBy,FileName ,PolicyType } = criteria;

    console.log('Filtering with criteria:', criteria);

    return items.filter(item => {
      const matchesAttachmentDate = AttachmentDate ? this.dateMatches(item.AttachmentDate, AttachmentDate) : true;
      const matchesEnteredBy = EnteredBy ? (item.EnteredBy ? item.EnteredBy.toLowerCase().includes(EnteredBy.toLowerCase()) : false) : true;
      const matchesDescription = Description ? (item.Description ? item.Description.toLowerCase().includes(Description.toLowerCase()) : false) : true;
      const matchesFileName = FileName ? (item.FileName ? item.FileName.toLowerCase().includes(FileName.toLowerCase()) : false) : true;
      const matchesPolicyType = PolicyType ? (item.PolicyType ? item.PolicyType.toLowerCase().includes(PolicyType.toLowerCase()) : false) : true;

      const result = matchesAttachmentDate && matchesEnteredBy && matchesDescription && matchesFileName && matchesPolicyType;

      console.log(`Item: ${item.AttachmentDate}, Result: ${result}`);
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

    console.log(`Comparing dates: Item Date - ${itemDateParsed.toISOString()}, Criteria Date - ${criteriaDateParsed.toISOString()}`);
    return itemDateParsed.toDateString() === criteriaDateParsed.toDateString();
  }

  private parseDate(dateString: string): Date | null {
    // Remove the time component if present
    dateString = dateString.split('T')[0];

    // Handle ISO format (yyyy-MM-dd)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const parsedDate = new Date(dateString);
      if (!isNaN(parsedDate.getTime())) {
        console.log(`Parsed date (ISO format): ${parsedDate.toISOString()}`);
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
