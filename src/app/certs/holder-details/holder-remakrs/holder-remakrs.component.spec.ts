import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolderRemakrsComponent } from './holder-remakrs.component';

describe('HolderRemakrsComponent', () => {
  let component: HolderRemakrsComponent;
  let fixture: ComponentFixture<HolderRemakrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolderRemakrsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HolderRemakrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
