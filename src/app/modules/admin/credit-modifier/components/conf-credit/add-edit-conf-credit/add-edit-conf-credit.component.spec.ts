import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditConfCreditComponent } from './add-edit-conf-credit.component';

describe('AddEditRankCreditComponent', () => {
  let component: AddEditConfCreditComponent;
  let fixture: ComponentFixture<AddEditConfCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditConfCreditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditConfCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
