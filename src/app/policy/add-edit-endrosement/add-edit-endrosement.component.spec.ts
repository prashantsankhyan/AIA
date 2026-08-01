import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEndrosementComponent } from './add-edit-endrosement.component';

describe('AddEditEndrosementComponent', () => {
  let component: AddEditEndrosementComponent;
  let fixture: ComponentFixture<AddEditEndrosementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditEndrosementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditEndrosementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
