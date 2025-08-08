import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateBorrowerComponent } from './corporate-borrower.component';

describe('CorporateInvestorComponent', () => {
  let component: CorporateBorrowerComponent;
  let fixture: ComponentFixture<CorporateBorrowerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateBorrowerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorporateBorrowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
