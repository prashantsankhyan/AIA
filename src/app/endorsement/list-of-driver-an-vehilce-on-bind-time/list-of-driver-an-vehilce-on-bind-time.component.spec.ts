import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfDriverAnVehilceOnBindTimeComponent } from './list-of-driver-an-vehilce-on-bind-time.component';

describe('ListOfDriverAnVehilceOnBindTimeComponent', () => {
  let component: ListOfDriverAnVehilceOnBindTimeComponent;
  let fixture: ComponentFixture<ListOfDriverAnVehilceOnBindTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfDriverAnVehilceOnBindTimeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfDriverAnVehilceOnBindTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
