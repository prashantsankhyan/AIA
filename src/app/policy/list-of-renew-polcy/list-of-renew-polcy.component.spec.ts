import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfRenewPolcyComponent } from './list-of-renew-polcy.component';

describe('ListOfRenewPolcyComponent', () => {
  let component: ListOfRenewPolcyComponent;
  let fixture: ComponentFixture<ListOfRenewPolcyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfRenewPolcyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfRenewPolcyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
