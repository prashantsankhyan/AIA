import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDataByExcelComponent } from './add-data-by-excel.component';

describe('AddDataByExcelComponent', () => {
  let component: AddDataByExcelComponent;
  let fixture: ComponentFixture<AddDataByExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDataByExcelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddDataByExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
