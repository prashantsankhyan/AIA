import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertsHolderListComponent } from './certs-holder-list.component';

describe('CertsHolderListComponent', () => {
  let component: CertsHolderListComponent;
  let fixture: ComponentFixture<CertsHolderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertsHolderListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CertsHolderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
