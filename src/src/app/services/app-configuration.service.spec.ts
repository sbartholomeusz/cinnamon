import { TestBed } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';

import { ApplicationConfigurationService } from './app-configuration.service';

describe('AppConfigurationService', () => {
  let service: ApplicationConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSidenavModule]
    });
    service = TestBed.inject(ApplicationConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all configurations', () => {
    let configs = service.getAllConfigurations();
    
    // TM data
    expect(configs.tmClubDatasUrl).toBeDefined();
    expect(configs.tmClubDatasUrl).not.toBeNull();
    expect(configs.tmClubDatasUrl).not.toEqual('');

    // Miscellaneous configurations
    expect(configs.githubProjectUrl).toBeDefined();
    expect(configs.githubProjectUrl).not.toBeNull();
    expect(configs.githubProjectUrl).not.toEqual('');
  });
});
