import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataNavComponent } from './data-nav.component';

describe('DataNavComponent', () => {
  let component: DataNavComponent;
  let fixture: ComponentFixture<DataNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataNavComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
