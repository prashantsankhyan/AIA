import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddListOfClaimsAttachComponent } from './add-list-of-claims-attach.component';

describe('AddListOfClaimsAttachComponent', () => {
  let component: AddListOfClaimsAttachComponent;
  let fixture: ComponentFixture<AddListOfClaimsAttachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddListOfClaimsAttachComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddListOfClaimsAttachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
