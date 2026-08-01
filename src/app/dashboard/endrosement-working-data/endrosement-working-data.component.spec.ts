import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndrosementWorkingDataComponent } from './endrosement-working-data.component';

describe('EndrosementWorkingDataComponent', () => {
  let component: EndrosementWorkingDataComponent;
  let fixture: ComponentFixture<EndrosementWorkingDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndrosementWorkingDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EndrosementWorkingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
