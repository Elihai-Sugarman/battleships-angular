import { TestBed } from '@angular/core/testing';

import { BattleshipsService } from './battleships.service';

describe('BattleshipsService', () => {
  let service: BattleshipsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BattleshipsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
