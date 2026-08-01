import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditLossRunComponent } from './add-edit-loss-run.component';

describe('AddEditLossRunComponent', () => {
  let component: AddEditLossRunComponent;
  let fixture: ComponentFixture<AddEditLossRunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditLossRunComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditLossRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
