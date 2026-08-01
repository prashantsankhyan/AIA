import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolderDetailsComponent } from './holder-details.component';

describe('HolderDetailsComponent', () => {
  let component: HolderDetailsComponent;
  let fixture: ComponentFixture<HolderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolderDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HolderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
