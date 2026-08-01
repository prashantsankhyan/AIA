import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoreDeletedDataComponent } from './restore-deleted-data.component';

describe('RestoreDeletedDataComponent', () => {
  let component: RestoreDeletedDataComponent;
  let fixture: ComponentFixture<RestoreDeletedDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestoreDeletedDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RestoreDeletedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
