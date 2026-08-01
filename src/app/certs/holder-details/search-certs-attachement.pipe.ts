import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchCertsAttachement',
  standalone: true
})
export class SearchCertsAttachementPipe implements PipeTransform {

 transform(items: any[], criteria: any): any[] {
    if (!items) return [];
    if (!criteria) return items;

    const {
      EnteredDateTime,
      HoldingDetails,
      EnteredBy,
      FileName,
      HoldingID,
      FileID,
      AttachmentDate,
      Description
    } = criteria;

    console.log('Filtering with criteria:', criteria);

    return items.filter(item => {
      const matchesEnteredDateTime = EnteredDateTime
        ? this.dateMatches(item.EnteredDateTime, EnteredDateTime)
        : true;

      const matchesEnteredBy = EnteredBy
        ? (item.EnteredBy?.toLowerCase().includes(EnteredBy.toLowerCase()))
        : true;

      const matchesHoldingDetails = HoldingDetails
        ? (item.HoldingDetails?.toLowerCase().includes(HoldingDetails.toLowerCase()))
        : true;

      const matchesHoldingID = HoldingID
        ? item.HoldingID?.toString().includes(HoldingID.toString())
        : true;

      const matchesFileID = FileID
        ? item.FileID?.toString() === FileID.toString()
        : true;

      const matchesDescription = Description
        ? (item.Description?.toLowerCase().includes(Description.toLowerCase()))
        : true;

      const matchesAttachmentDate = AttachmentDate
        ? this.dateMatches(item.AttachmentDate, AttachmentDate)
        : true;

      const result =
        matchesEnteredDateTime &&
        matchesEnteredBy &&
        matchesHoldingDetails &&
        matchesHoldingID &&
        matchesFileID &&
        matchesAttachmentDate &&
        matchesDescription;

      console.log(`Item: ${item.FileID}, Result: ${result}`);
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
    try {
      // Remove time component if present
      dateString = dateString.split('T')[0];

      // Handle ISO format (yyyy-MM-dd)
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const parsedDate = new Date(dateString);
        if (!isNaN(parsedDate.getTime())) {
          console.log(`Parsed date (ISO format): ${parsedDate.toISOString()}`);
          return parsedDate;
        }
      }

      // Handle MM-dd-yyyy
      const dashParts = dateString.split('-');
      if (dashParts.length === 3) {
        const [month, day, year] = dashParts.map(part => parseInt(part, 10));
        const parsedDate = new Date(year, month - 1, day);
        if (parsedDate.getFullYear() === year && parsedDate.getMonth() === month - 1 && parsedDate.getDate() === day) {
          console.log(`Parsed date (MM-dd-yyyy): ${parsedDate.toISOString()}`);
          return parsedDate;
        }
      }

      // Handle MM/dd/yyyy
      const slashParts = dateString.split('/');
      if (slashParts.length === 3) {
        const [month, day, year] = slashParts.map(part => parseInt(part, 10));
        const parsedDate = new Date(year, month - 1, day);
        if (parsedDate.getFullYear() === year && parsedDate.getMonth() === month - 1 && parsedDate.getDate() === day) {
          console.log(`Parsed date (MM/dd/yyyy): ${parsedDate.toISOString()}`);
          return parsedDate;
        }
      }
    } catch (e) {
      console.warn(`Date parse failed: ${dateString}`);
    }

    console.warn(`Invalid date format: ${dateString}`);
    return null;
  }



}
