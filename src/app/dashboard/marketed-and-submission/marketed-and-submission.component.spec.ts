import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketedAndSubmissionComponent } from './marketed-and-submission.component';

describe('MarketedAndSubmissionComponent', () => {
  let component: MarketedAndSubmissionComponent;
  let fixture: ComponentFixture<MarketedAndSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketedAndSubmissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MarketedAndSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
