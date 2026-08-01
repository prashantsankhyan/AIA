import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndrosementDetailsComponent } from './endrosement-details.component';

describe('EndrosementDetailsComponent', () => {
  let component: EndrosementDetailsComponent;
  let fixture: ComponentFixture<EndrosementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndrosementDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EndrosementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
