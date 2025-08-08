import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalBorrowerComponent } from './personal-borrower.component';

describe('PersonalInvestorComponent', () => {
  let component: PersonalBorrowerComponent;
  let fixture: ComponentFixture<PersonalBorrowerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalBorrowerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalBorrowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
