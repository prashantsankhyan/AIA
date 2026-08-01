import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditLossRunDetailsComponent } from './add-or-edit-loss-run-details.component';

describe('AddOrEditLossRunDetailsComponent', () => {
  let component: AddOrEditLossRunDetailsComponent;
  let fixture: ComponentFixture<AddOrEditLossRunDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOrEditLossRunDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddOrEditLossRunDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
