import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimWorkingDataComponent } from './claim-working-data.component';

describe('ClaimWorkingDataComponent', () => {
  let component: ClaimWorkingDataComponent;
  let fixture: ComponentFixture<ClaimWorkingDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimWorkingDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClaimWorkingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
