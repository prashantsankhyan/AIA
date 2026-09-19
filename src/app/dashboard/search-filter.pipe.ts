import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
  standalone: true
})
export class SearchFilterPipe implements PipeTransform {

  transform(items: any[], criteria: any): any[] {
    if (!items) return [];
    if (!criteria) return items;

    const { name,Email, lookUpCode, city, state, zip ,accountType,claimNumber,childPolicyName} = criteria;

    console.log('Filtering with criteria:', criteria);

    return items.filter(item => {
      const itemName = item.AccountName ? item.AccountName.toLowerCase() : '';
      const EmailID = item.EmailID ? item.EmailID.toLowerCase() : '';
      const itemLookUpCode = item.LookUpCode ? item.LookUpCode.toLowerCase() : '';
      const itemCity = item.City ? item.City.toLowerCase() : '';
      const itemState = item.State ? item.State.toLowerCase() : '';
      const itemZip = item.ZIP ? item.ZIP.toLowerCase() : '';
      const itemAccountType = item.AccountType ? item.AccountType.toLowerCase() : '';
const matchesChildPolicy = childPolicyName
  ? item.ChildPolicyNames?.some((policy: string) =>
      policy.toLowerCase().includes(childPolicyName.toLowerCase())
    )
  : true;
      const matchesName = name ? itemName.includes(name.toLowerCase()) : true;
       const matchesEmailID = Email ? EmailID.includes(Email.toLowerCase()) : true;
    
      const matchesLookUpCode = lookUpCode ? itemLookUpCode.includes(lookUpCode.toLowerCase()) : true;
      const matchesCity = city ? itemCity.includes(city.toLowerCase()) : true;
      const matchesState = state ? itemState.includes(state.toLowerCase()) : true;
      const matchesZip = zip ? itemZip.includes(zip.toLowerCase()) : true;
      const matchesAccountType = accountType ? itemAccountType.includes(accountType.toLowerCase()) : true;
      const matchesClaimNumber = claimNumber ? item.AccountClaims.some((claim:any) => 
        claim.ClaimNumber && claim.ClaimNumber.includes(claimNumber)
      ) : true;
      const result = matchesName && matchesEmailID && matchesLookUpCode && matchesCity && matchesState && matchesZip && matchesAccountType && matchesClaimNumber && matchesChildPolicy;

      console.log(`Item: ${item.AccountName} matches: ${result}`);
      return result;
    });
  }

}
  



