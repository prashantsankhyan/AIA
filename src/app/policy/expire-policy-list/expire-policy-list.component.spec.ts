import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpirePolicyListComponent } from './expire-policy-list.component';

describe('ExpirePolicyListComponent', () => {
  let component: ExpirePolicyListComponent;
  let fixture: ComponentFixture<ExpirePolicyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpirePolicyListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpirePolicyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
