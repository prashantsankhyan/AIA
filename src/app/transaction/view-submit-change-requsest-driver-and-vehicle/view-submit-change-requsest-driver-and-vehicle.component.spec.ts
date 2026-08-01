import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubmitChangeRequsestDriverAndVehicleComponent } from './view-submit-change-requsest-driver-and-vehicle.component';

describe('ViewSubmitChangeRequsestDriverAndVehicleComponent', () => {
  let component: ViewSubmitChangeRequsestDriverAndVehicleComponent;
  let fixture: ComponentFixture<ViewSubmitChangeRequsestDriverAndVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSubmitChangeRequsestDriverAndVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewSubmitChangeRequsestDriverAndVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
