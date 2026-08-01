import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckersGeneralLiabilityComponent } from './truckers-general-liability.component';

describe('TruckersGeneralLiabilityComponent', () => {
  let component: TruckersGeneralLiabilityComponent;
  let fixture: ComponentFixture<TruckersGeneralLiabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TruckersGeneralLiabilityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TruckersGeneralLiabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
