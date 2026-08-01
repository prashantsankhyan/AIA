import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfAllDataOfRenewComponent } from './list-of-all-data-of-renew.component';

describe('ListOfAllDataOfRenewComponent', () => {
  let component: ListOfAllDataOfRenewComponent;
  let fixture: ComponentFixture<ListOfAllDataOfRenewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfAllDataOfRenewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfAllDataOfRenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
