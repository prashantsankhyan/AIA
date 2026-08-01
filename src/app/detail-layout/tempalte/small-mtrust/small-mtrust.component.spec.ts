import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallMtrustComponent } from './small-mtrust.component';

describe('SmallMtrustComponent', () => {
  let component: SmallMtrustComponent;
  let fixture: ComponentFixture<SmallMtrustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmallMtrustComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmallMtrustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
