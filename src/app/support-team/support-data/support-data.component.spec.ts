import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportDataComponent } from './support-data.component';

describe('SupportDataComponent', () => {
  let component: SupportDataComponent;
  let fixture: ComponentFixture<SupportDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupportDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
