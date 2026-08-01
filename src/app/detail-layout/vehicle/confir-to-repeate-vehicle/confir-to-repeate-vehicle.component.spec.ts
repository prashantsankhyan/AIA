import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirToRepeateVehicleComponent } from './confir-to-repeate-vehicle.component';

describe('ConfirToRepeateVehicleComponent', () => {
  let component: ConfirToRepeateVehicleComponent;
  let fixture: ComponentFixture<ConfirToRepeateVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirToRepeateVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirToRepeateVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
