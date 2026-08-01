import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReAddedDataComponent } from './re-added-data.component';

describe('ReAddedDataComponent', () => {
  let component: ReAddedDataComponent;
  let fixture: ComponentFixture<ReAddedDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReAddedDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReAddedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
