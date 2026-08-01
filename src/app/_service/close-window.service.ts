import { Injectable } from '@angular/core';
import { LogoutService } from './logout.service';

@Injectable({
  providedIn: 'root'
})
export class CloseWindowService {

  cleanSessionOnTabClose() {
    console.log('Session cleanup on tab close.');
    sessionStorage.removeItem('sessionToken'); // Remove session token or other cleanup logic
  }
}
