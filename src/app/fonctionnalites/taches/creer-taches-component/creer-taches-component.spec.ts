import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerTachesComponent } from './creer-taches-component';

describe('CreerTachesComponent', () => {
  let component: CreerTachesComponent;
  let fixture: ComponentFixture<CreerTachesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerTachesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerTachesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
