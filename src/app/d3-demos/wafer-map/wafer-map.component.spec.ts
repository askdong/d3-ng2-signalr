/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WaferMapComponent } from './wafer-map.component';

describe('WaferMapComponent', () => {
  let component: WaferMapComponent;
  let fixture: ComponentFixture<WaferMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaferMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaferMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
