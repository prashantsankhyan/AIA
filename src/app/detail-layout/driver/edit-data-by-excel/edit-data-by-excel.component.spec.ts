import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDataByExcelComponent } from './edit-data-by-excel.component';

describe('EditDataByExcelComponent', () => {
  let component: EditDataByExcelComponent;
  let fixture: ComponentFixture<EditDataByExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDataByExcelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditDataByExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
