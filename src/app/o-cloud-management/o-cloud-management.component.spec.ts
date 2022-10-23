import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OCloudManagementComponent } from './o-cloud-management.component';

describe('OCloudManagementComponent', () => {
  let component: OCloudManagementComponent;
  let fixture: ComponentFixture<OCloudManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OCloudManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OCloudManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
