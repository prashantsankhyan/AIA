import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllEndrosmentListComponent } from './view-all-endrosment-list.component';

describe('ViewAllEndrosmentListComponent', () => {
  let component: ViewAllEndrosmentListComponent;
  let fixture: ComponentFixture<ViewAllEndrosmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAllEndrosmentListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAllEndrosmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
