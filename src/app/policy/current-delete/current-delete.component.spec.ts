import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentDeleteComponent } from './current-delete.component';

describe('CurrentDeleteComponent', () => {
  let component: CurrentDeleteComponent;
  let fixture: ComponentFixture<CurrentDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentDeleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurrentDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
