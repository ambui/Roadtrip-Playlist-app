import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistMakerComponent } from './playlist-maker.component';

describe('PlaylistMakerComponent', () => {
  let component: PlaylistMakerComponent;
  let fixture: ComponentFixture<PlaylistMakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistMakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
