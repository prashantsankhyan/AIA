import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditEndrosementComponent } from './add-or-edit-endrosement.component';

describe('AddOrEditEndrosementComponent', () => {
  let component: AddOrEditEndrosementComponent;
  let fixture: ComponentFixture<AddOrEditEndrosementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOrEditEndrosementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddOrEditEndrosementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
