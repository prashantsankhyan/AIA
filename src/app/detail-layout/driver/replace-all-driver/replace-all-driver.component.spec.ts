import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplaceAllDriverComponent } from './replace-all-driver.component';

describe('ReplaceAllDriverComponent', () => {
  let component: ReplaceAllDriverComponent;
  let fixture: ComponentFixture<ReplaceAllDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplaceAllDriverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReplaceAllDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
