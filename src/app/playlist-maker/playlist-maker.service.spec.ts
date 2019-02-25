import { TestBed } from '@angular/core/testing';

import { PlaylistMakerService } from './playlist-maker.service';

describe('PlaylistMakerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlaylistMakerService = TestBed.get(PlaylistMakerService);
    expect(service).toBeTruthy();
  });
});
