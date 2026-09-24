import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchHolder',
  standalone: true
})
export class SearchHolderPipe implements PipeTransform {
  // Apni required US timezone yahan set karein
  private readonly usaTimeZone = 'America/New_York';

  transform(items: any[], criteria: any): any[] {
    if (!items) return [];
    if (!criteria) return items;

    const {
      EnteredDateTime,
      HoldingDetails,
      EnteredBy,
      HoldingID
    } = criteria;

    return items.filter(item => {
      const matchesEnteredDateTime = EnteredDateTime
        ? this.dateMatches(item.EnteredDateTime, EnteredDateTime)
        : true;

      const matchesEnteredBy = EnteredBy
        ? String(item.EnteredBy ?? '')
            .toLowerCase()
            .includes(String(EnteredBy).toLowerCase())
        : true;

      const matchesHoldingDetails = HoldingDetails
        ? String(item.HoldingDetails ?? '')
            .toLowerCase()
            .includes(String(HoldingDetails).toLowerCase())
        : true;

      const matchesHoldingID = HoldingID
        ? String(item.HoldingID ?? '').includes(String(HoldingID))
        : true;

      return (
        matchesEnteredDateTime &&
        matchesEnteredBy &&
        matchesHoldingDetails &&
        matchesHoldingID
      );
    });
  }

private dateMatches(itemDate: unknown, searchDate: unknown): boolean {
  const itemKey = this.toUsDateKey(itemDate); // YYYY-MM-DD
  if (!itemKey || !searchDate) return false;

  const search = String(searchDate).trim();

  // User types US format: 09, 09/04, 09/04/2026
  if (!/^\d{1,2}(?:\/\d{0,2}(?:\/\d{0,4})?)?$/.test(search)) {
    return false;
  }

  const displayDate = this.toUsDisplayDate(itemKey); // MM/DD/YYYY
  const [month, day, year] = displayDate.split('/');
  const parts = search.split('/');

  if (parts.length === 1) {
    return month.startsWith(parts[0]);
  }

  if (parts.length === 2) {
    return (
      month.startsWith(parts[0]) &&
      day.startsWith(parts[1])
    );
  }

  return (
    month.startsWith(parts[0]) &&
    day.startsWith(parts[1]) &&
    year.startsWith(parts[2])
  );
}

private toUsDisplayDate(dateKey: string): string {
  const [year, month, day] = dateKey.split('-');
  return `${month}/${day}/${year}`;
}

  private toUsDateKey(value: unknown): string | null {
    if (!value) return null;

    const text = String(value).trim();

    // US display/input format: MM/DD/YYYY
    const usDate = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (usDate) {
      return this.validDateKey(
        Number(usDate[3]),
        Number(usDate[1]),
        Number(usDate[2])
      );
    }

    // Date-only or SQL datetime without timezone:
    // treat its written date as the US calendar date
    const localDate = text.match(
      /^(\d{4})-(\d{2})-(\d{2})(?:[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?)?$/
    );
    if (localDate) {
      return this.validDateKey(
        Number(localDate[1]),
        Number(localDate[2]),
        Number(localDate[3])
      );
    }

    // Timestamp with Z or +/- offset: convert the actual instant
    // into the selected US timezone
    const timestamp = new Date(text);
    if (isNaN(timestamp.getTime())) return null;

    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: this.usaTimeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(timestamp);

    const get = (type: string) =>
      parts.find(part => part.type === type)?.value;

    return `${get('year')}-${get('month')}-${get('day')}`;
  }

  private validDateKey(
    year: number,
    month: number,
    day: number
  ): string | null {
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
}