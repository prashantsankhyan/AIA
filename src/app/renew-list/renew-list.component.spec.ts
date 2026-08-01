import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewListComponent } from './renew-list.component';

describe('RenewListComponent', () => {
  let component: RenewListComponent;
  let fixture: ComponentFixture<RenewListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenewListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RenewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
