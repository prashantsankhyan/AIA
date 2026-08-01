import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditClaimsComponent } from './add-edit-claims.component';

describe('AddEditClaimsComponent', () => {
  let component: AddEditClaimsComponent;
  let fixture: ComponentFixture<AddEditClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditClaimsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
