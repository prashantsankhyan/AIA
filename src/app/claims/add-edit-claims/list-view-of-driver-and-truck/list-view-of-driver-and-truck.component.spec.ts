import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListViewOfDriverAndTruckComponent } from './list-view-of-driver-and-truck.component';

describe('ListViewOfDriverAndTruckComponent', () => {
  let component: ListViewOfDriverAndTruckComponent;
  let fixture: ComponentFixture<ListViewOfDriverAndTruckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListViewOfDriverAndTruckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListViewOfDriverAndTruckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
