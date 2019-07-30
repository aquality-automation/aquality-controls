import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AQTableComponent } from './aq-table.component';

describe('AQTableComponent', () => {
  let component: AQTableComponent;
  let fixture: ComponentFixture<AQTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AQTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AQTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('component should be created', () => {
    expect(component).toBeTruthy();
  });
});
