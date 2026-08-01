import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MgBrokerComponent } from './mg-broker.component';

describe('MgBrokerComponent', () => {
  let component: MgBrokerComponent;
  let fixture: ComponentFixture<MgBrokerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MgBrokerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MgBrokerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
