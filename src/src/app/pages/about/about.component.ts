import { Component, OnInit } from '@angular/core';
import { ApplicationConfigurationService } from 'src/app/services/app-configuration.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  /** 
   * Global Variables
   */

  public github_project_url: string = '';  

  /** 
   * Methods
   */

  constructor(private configSvc: ApplicationConfigurationService) { }

  ngOnInit(): void {
    this.github_project_url = this.configSvc.getAllConfigurations()?.githubProjectUrl;
  }

}
