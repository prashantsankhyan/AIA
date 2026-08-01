import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayCarrierAndBrokerMGComponent } from './display-carrier-and-broker-mg.component';

describe('DisplayCarrierAndBrokerMGComponent', () => {
  let component: DisplayCarrierAndBrokerMGComponent;
  let fixture: ComponentFixture<DisplayCarrierAndBrokerMGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayCarrierAndBrokerMGComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplayCarrierAndBrokerMGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
