import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingNotificationDetailComponent } from './setting-notification-detail.component';

describe('SettingNotificationDetailComponent', () => {
  let component: SettingNotificationDetailComponent;
  let fixture: ComponentFixture<SettingNotificationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingNotificationDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingNotificationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
