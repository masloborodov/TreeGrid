import { TestBed } from '@angular/core/testing';

import { SoursDataService } from './sours-data.service';

describe('SoursDataService', () => {
  let service: SoursDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoursDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
