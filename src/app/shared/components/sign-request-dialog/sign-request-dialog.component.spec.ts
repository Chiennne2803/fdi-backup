import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignRequestDialogComponent } from './sign-request-dialog.component';

describe('SignRequestDialogComponent', () => {
  let component: SignRequestDialogComponent;
  let fixture: ComponentFixture<SignRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignRequestDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
