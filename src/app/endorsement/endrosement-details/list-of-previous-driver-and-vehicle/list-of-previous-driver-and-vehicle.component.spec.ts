import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfPreviousDriverAndVehicleComponent } from './list-of-previous-driver-and-vehicle.component';

describe('ListOfPreviousDriverAndVehicleComponent', () => {
  let component: ListOfPreviousDriverAndVehicleComponent;
  let fixture: ComponentFixture<ListOfPreviousDriverAndVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfPreviousDriverAndVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfPreviousDriverAndVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
