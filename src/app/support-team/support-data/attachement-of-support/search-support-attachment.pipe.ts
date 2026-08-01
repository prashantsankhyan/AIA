import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchSupportAttachment',
  standalone: true
})
export class SearchSupportAttachmentPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      // Ensure we check all required fields
      return (
        (item?.UnderPolicy || '').toLowerCase().includes(searchText) ||
        (item?.Description || '').toLowerCase().includes(searchText) ||
        (item?.AttachmentDate
          ? new Date(item.AttachmentDate)
              .toLocaleDateString('en-GB') // dd/MM/yyyy
              .toLowerCase()
          : ''
        ).includes(searchText) ||
        (item?.EnteredBy || '').toLowerCase().includes(searchText)
      );
    });
  }

}
