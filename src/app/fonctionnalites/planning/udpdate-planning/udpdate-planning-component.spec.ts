import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UdpdatePlanningComponent } from './udpdate-planning-component';

describe('UdpdatePlanningComponent', () => {
  let component: UdpdatePlanningComponent;
  let fixture: ComponentFixture<UdpdatePlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UdpdatePlanningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UdpdatePlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
