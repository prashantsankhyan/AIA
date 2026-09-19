// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'searchRenewList',
//   standalone: true
// })
// export class SearchRenewListPipe implements PipeTransform {

//   transform(items: any[], criteria: any): any[] {
//     if (!items || !criteria) return items || [];

//     const { Expiration,AccountName ,LookUpCode, ExpireInDays,ChildPolicyName } = criteria;

//     return items.filter(item => {
//       const matchesExpiration = Expiration ? this.dateMatches(item.Expiration, Expiration) : true;
//       const matchesChildPolicy = ChildPolicyName? item?.ChildPolicyName?.toLowerCase().includes(ChildPolicyName.toLowerCase()) ?? false: true;
//       const matchesExpireInDays = this.daysMatch(item.ExpireInDays, ExpireInDays);
//       const matchesLookUpCode = LookUpCode?item?.LookUpCode?.toLowerCase().includes(LookUpCode.toLowerCase()) ?? false: true;
//       const matchesAccountName = AccountName?item?.AccountName?.toLowerCase().includes(AccountName.toLowerCase()) ?? false: true;

//       return matchesExpiration && matchesExpireInDays && matchesLookUpCode && matchesChildPolicy && matchesAccountName;
      
//     });
//   }

//   private dateMatches(itemDate: string, criteriaDate: string): boolean {
//     const itemParsed = this.parseDate(itemDate);
//     const criteriaParsed = this.parseDate(criteriaDate);

//     if (!itemParsed || !criteriaParsed) return false;

//     return itemParsed.toDateString() === criteriaParsed.toDateString();
//   }

//   private daysMatch(itemValue: any, criteriaValue: any): boolean {
//     const itemStr = `${itemValue}`.trim();
//     const criteriaStr = `${criteriaValue}`.trim();
  
//     if (itemStr === '' || criteriaStr === '') return true;
  
//     const itemNumber = parseInt(itemStr, 10);
//     const criteriaNumber = parseInt(criteriaStr, 10);
  
//     if (isNaN(itemNumber) || isNaN(criteriaNumber)) return false;
  
//     return itemNumber === criteriaNumber;
//   }

//   private parseDate(dateString: string): Date | null {
//     if (typeof dateString !== 'string') return null;

//     const trimmed = dateString.split('T')[0];

//     // Try ISO format: yyyy-MM-dd
//     if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
//       const isoDate = new Date(trimmed);
//       return isNaN(isoDate.getTime()) ? null : isoDate;
//     }

//     // Try MM-dd-yyyy or MM/dd/yyyy
//     const parts = trimmed.includes('-') ? trimmed.split('-') : trimmed.split('/');
//     if (parts.length === 3) {
//       const [month, day, year] = parts.map(part => parseInt(part, 10));
//       const parsedDate = new Date(year, month - 1, day);
//       if (
//         parsedDate.getFullYear() === year &&
//         parsedDate.getMonth() === month - 1 &&
//         parsedDate.getDate() === day
//       ) {
//         return parsedDate;
//       }
//     }

//     return null;
//   }
// }


import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchRenewList',
  standalone: true
})
export class SearchRenewListPipe implements PipeTransform {

  transform(items: any[], criteria: any): any[] {
    if (!items || !criteria) return items || [];

    const {
      Expiration,
      AccountName,
      LookUpCode,
      ExpireInDays,
      ExpireInDaysTo,
      ChildPolicyName
    } = criteria;

    return items.filter(item => {

      const matchesExpiration =
        Expiration
          ? this.dateMatches(item.Expiration, Expiration)
          : true;

      const matchesChildPolicy =
        ChildPolicyName
          ? item?.ChildPolicyName?.toLowerCase()
              .includes(ChildPolicyName.toLowerCase()) ?? false
          : true;

      // Existing search - EXACT MATCH
      const matchesExpireInDays =
        this.daysMatch(item.ExpireInDays, ExpireInDays);

      // New search - 1 to entered number
      const matchesExpireInDaysTo =
        this.daysUpToMatch(item.ExpireInDays, ExpireInDaysTo);

      const matchesLookUpCode =
        LookUpCode
          ? item?.LookUpCode?.toLowerCase()
              .includes(LookUpCode.toLowerCase()) ?? false
          : true;

      const matchesAccountName =
        AccountName
          ? item?.AccountName?.toLowerCase()
              .includes(AccountName.toLowerCase()) ?? false
          : true;

      return (
        matchesExpiration &&
        matchesExpireInDays &&
        matchesExpireInDaysTo &&
        matchesLookUpCode &&
        matchesChildPolicy &&
        matchesAccountName
      );
    });
  }

  // Existing ExpireInDays search
  // Keeps EXACT matching
  private daysMatch(
    itemValue: any,
    criteriaValue: any
  ): boolean {

    const itemStr = `${itemValue ?? ''}`.trim();
    const criteriaStr = `${criteriaValue ?? ''}`.trim();

    if (itemStr === '' || criteriaStr === '') return true;

    const itemNumber = parseInt(itemStr, 10);
    const criteriaNumber = parseInt(criteriaStr, 10);

    if (isNaN(itemNumber) || isNaN(criteriaNumber)) {
      return false;
    }

    return itemNumber === criteriaNumber;
  }

  // NEW SEARCH
  // Example:
  // ExpireInDaysTo = 40
  // Shows 1, 2, 3 ... 38, 39, 40
  private daysUpToMatch(
    itemValue: any,
    criteriaValue: any
  ): boolean {

    const criteriaStr = `${criteriaValue ?? ''}`.trim();

    // No value entered = don't filter
    if (criteriaStr === '') return true;

    const itemNumber = parseInt(`${itemValue ?? ''}`.trim(), 10);
    const criteriaNumber = parseInt(criteriaStr, 10);

    if (isNaN(itemNumber) || isNaN(criteriaNumber)) {
      return false;
    }

    return itemNumber >= 1 && itemNumber <= criteriaNumber;
  }

  private dateMatches(
    itemDate: string,
    criteriaDate: string
  ): boolean {

    const itemParsed = this.parseDate(itemDate);
    const criteriaParsed = this.parseDate(criteriaDate);

    if (!itemParsed || !criteriaParsed) return false;

    return itemParsed.toDateString() === criteriaParsed.toDateString();
  }

  private parseDate(dateString: string): Date | null {

    if (typeof dateString !== 'string') return null;

    const trimmed = dateString.split('T')[0];

    // Try ISO format: yyyy-MM-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {

      const isoDate = new Date(trimmed);

      return isNaN(isoDate.getTime())
        ? null
        : isoDate;
    }

    // Try MM-dd-yyyy or MM/dd/yyyy
    const parts = trimmed.includes('-')
      ? trimmed.split('-')
      : trimmed.split('/');

    if (parts.length === 3) {

      const [month, day, year] =
        parts.map(part => parseInt(part, 10));

      const parsedDate =
        new Date(year, month - 1, day);

      if (
        parsedDate.getFullYear() === year &&
        parsedDate.getMonth() === month - 1 &&
        parsedDate.getDate() === day
      ) {
        return parsedDate;
      }
    }

    return null;
  }
}