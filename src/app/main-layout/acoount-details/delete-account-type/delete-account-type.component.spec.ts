import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAccountTypeComponent } from './delete-account-type.component';

describe('DeleteAccountTypeComponent', () => {
  let component: DeleteAccountTypeComponent;
  let fixture: ComponentFixture<DeleteAccountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAccountTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteAccountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
