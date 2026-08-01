import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitChangeRequestComponent } from './submit-change-request.component';

describe('SubmitChangeRequestComponent', () => {
  let component: SubmitChangeRequestComponent;
  let fixture: ComponentFixture<SubmitChangeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitChangeRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubmitChangeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
