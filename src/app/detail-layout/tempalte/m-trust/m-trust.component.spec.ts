import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MTrustComponent } from './m-trust.component';

describe('MTrustComponent', () => {
  let component: MTrustComponent;
  let fixture: ComponentFixture<MTrustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MTrustComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MTrustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
