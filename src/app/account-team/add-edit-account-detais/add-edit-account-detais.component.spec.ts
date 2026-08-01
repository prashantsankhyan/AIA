import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAccountDetaisComponent } from './add-edit-account-detais.component';

describe('AddEditAccountDetaisComponent', () => {
  let component: AddEditAccountDetaisComponent;
  let fixture: ComponentFixture<AddEditAccountDetaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditAccountDetaisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditAccountDetaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
