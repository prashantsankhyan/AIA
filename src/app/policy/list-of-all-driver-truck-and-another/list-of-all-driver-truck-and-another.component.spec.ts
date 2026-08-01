import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfAllDriverTruckAndAnotherComponent } from './list-of-all-driver-truck-and-another.component';

describe('ListOfAllDriverTruckAndAnotherComponent', () => {
  let component: ListOfAllDriverTruckAndAnotherComponent;
  let fixture: ComponentFixture<ListOfAllDriverTruckAndAnotherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfAllDriverTruckAndAnotherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfAllDriverTruckAndAnotherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
