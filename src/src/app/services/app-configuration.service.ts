import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationConfigurationService {

  constructor() { }

  /**
   * Fetch all application configuration settings
   * @returns configuration settings
   */
  public getAllConfigurations() :IAppConfiguration {
    const configs: IAppConfiguration = {
      tmClubDatasUrl: "./assets/tm-club.json",
      githubProjectUrl: environment.github_project_url
    }

    return configs;
  }
}

export interface IAppConfiguration {
  tmClubDatasUrl: string,
  githubProjectUrl: string
}