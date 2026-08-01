import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachementOfSupportComponent } from './attachement-of-support.component';

describe('AttachementOfSupportComponent', () => {
  let component: AttachementOfSupportComponent;
  let fixture: ComponentFixture<AttachementOfSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachementOfSupportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttachementOfSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
