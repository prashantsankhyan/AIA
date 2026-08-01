import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataRefreshService {

  private refreshSubject = new Subject<void>();
  refreshRequested$ = this.refreshSubject.asObservable();

  requestRefresh() {
    console.log('reftss')
    this.refreshSubject.next(); // Notify all subscribers to refresh data
  }
}
