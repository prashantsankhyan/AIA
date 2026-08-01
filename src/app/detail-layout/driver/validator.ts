import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // Return null if value is empty or null
    if (!value) {
      return null;
    }

    // Check if value is a string
    if (typeof value !== 'string') {
      return { invalidDate: true };
    }

    // Regular expression for MM/dd/YYYY format
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$/;

    // Check if the value matches the regex
    const valid = regex.test(value);

    // Return validation result
    return valid ? null : { invalidDate: true };
  };
}

// Function to preprocess date input
function preprocessDateInput(dateStr: string): string {
  const [month, day, year] = dateStr.split('/').map(part => part.padStart(2, '0'));
  return `${month}/${day}/${year}`;
}

// Usage in component

