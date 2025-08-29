import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerPlanningComponent } from './creer-planning-component';

describe('CreerPlanningComponent', () => {
  let component: CreerPlanningComponent;
  let fixture: ComponentFixture<CreerPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerPlanningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
