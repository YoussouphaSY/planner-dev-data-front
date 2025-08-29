import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UdpdatePeriodeComponent } from './udpdate-periode-component';

describe('UdpdatePeriodeComponent', () => {
  let component: UdpdatePeriodeComponent;
  let fixture: ComponentFixture<UdpdatePeriodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UdpdatePeriodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UdpdatePeriodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
