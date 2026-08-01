import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAdjunsterComponent } from './add-edit-adjunster.component';

describe('AddEditAdjunsterComponent', () => {
  let component: AddEditAdjunsterComponent;
  let fixture: ComponentFixture<AddEditAdjunsterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditAdjunsterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditAdjunsterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
