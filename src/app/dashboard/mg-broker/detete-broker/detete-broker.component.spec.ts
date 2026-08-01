import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeteteBrokerComponent } from './detete-broker.component';

describe('DeteteBrokerComponent', () => {
  let component: DeteteBrokerComponent;
  let fixture: ComponentFixture<DeteteBrokerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeteteBrokerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeteteBrokerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
