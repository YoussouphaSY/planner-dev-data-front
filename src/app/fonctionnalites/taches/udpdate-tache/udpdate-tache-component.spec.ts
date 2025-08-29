import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UdpdateTacheComponent } from './udpdate-tache-component';

describe('UdpdateTacheComponent', () => {
  let component: UdpdateTacheComponent;
  let fixture: ComponentFixture<UdpdateTacheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UdpdateTacheComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UdpdateTacheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
