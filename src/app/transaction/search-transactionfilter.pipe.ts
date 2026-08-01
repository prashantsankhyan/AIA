import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchTransactionfilter',
  standalone: true
})
export class SearchTransactionfilterPipe implements PipeTransform {

  transform(items: any[], criteria: any): any[] {
    if (!items) return [];
    if (!criteria) return items;

    const { ARDue, amount, enteredBy, GenerateInvoice, Child_EffectiveDate, Child_ExpirationDate } = criteria;

    console.log('Filtering with criteria:', criteria);

    return items.filter(item => {
      const matchesARDue = ARDue ? this.dateMatches(item.ARDue, ARDue) : true;
      const matchesGenerateInvoice = GenerateInvoice ? this.dateMatches(item.GenerateInvoice, GenerateInvoice) : true;
     
      const matchesChild_EffectiveDate = Child_EffectiveDate ? this.dateMatches(item.Child_EffectiveDate, Child_EffectiveDate) : true;
      const matchesChild_ExpirationDate = Child_ExpirationDate ? this.dateMatches(item.Child_ExpirationDate, Child_ExpirationDate) : true;
      const matchesEnteredBy = enteredBy ? (item.EnteredBy ? item.EnteredBy.toLowerCase().includes(enteredBy.toLowerCase()) : false) : true;

      const result = matchesARDue && matchesGenerateInvoice && matchesChild_EffectiveDate && matchesChild_ExpirationDate && matchesEnteredBy;

      console.log(`Item: ${item.ARDue}, Result: ${result}`);
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
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [month, day, year] = parts.map(part => parseInt(part, 10));
      const parsedDate = new Date(year, month - 1, day); // month is 0-based
      if (parsedDate.getFullYear() === year && parsedDate.getMonth() === month - 1 && parsedDate.getDate() === day) {
        console.log(`Parsed date (MM-dd-yyyy format): ${parsedDate.toISOString()}`);
        return parsedDate;
      }
    }

    // Return null if parsing fails
    console.warn(`Invalid date format: ${dateString}`);
    return null;
  }
}
