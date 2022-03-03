import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CollectionsHelper } from '../common/helpers/collections/collections-helper';
import { ServiceHelper } from '../common/helpers/services/service-helper';
import { ApplicationConfigurationService } from './app-configuration.service';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})
export class ToastmastersService {
  private _tmClubDataUri: string = '';

  // Response cache
  private _clubDetailsRespCache: IGetAllClubDetailsResponse | null = null;
  private _allMembersRespCache: IGetAllMembersResponse | null = null;
  private _allClubOfficersRespCache: IGetAllClubOfficersResponse | null = null;
  private _allMeetingRolesRespCache: IGetAllMeetingRolesResponse | null = null;

  constructor(private appConfig: ApplicationConfigurationService, private http: HttpClient, private logger: LoggingService) { 
    const configs = this.appConfig.getAllConfigurations()
    this._tmClubDataUri = configs.tmClubDatasUrl;
  }

  /**
   * Get club details
   * @returns Club details
   */
   public async getAllClubDetails(): Promise<IGetAllClubDetailsResponse> {
    try {
      this.logger.Info("getAllClubDetails Start");

      if (!this._clubDetailsRespCache) { // Has the response already been cached?
        this._clubDetailsRespCache = await this.http.get<IGetAllClubDetailsResponse>(this._tmClubDataUri).toPromise();
      }

      return Promise.resolve(this._clubDetailsRespCache);
    } 
    catch (error: any) {
      this.logger.Error("An unexpected error occurred in ToastmastersService.getAllClubDetails ...");
      this.logger.Error(error);
      return <IGetAllClubDetailsResponse>{ clubName: "", clubMeetingSchedule: "", clubMissionStatement: "", clubWebsiteUrl: "" };
    }
  }

  /**
   * Get all club members
   * @returns Club members
   */
  public async getAllMembers(): Promise<IGetAllMembersResponse> {
    try {
      this.logger.Info("getAllMembers Start");

      if (!this._allMembersRespCache) { // Has the response already been cached?
        this._allMembersRespCache = await this.http.get<IGetAllMembersResponse>(this._tmClubDataUri).toPromise();
      }

      return Promise.resolve(ServiceHelper.cloneObject(this._allMembersRespCache));
    } 
    catch (error: any) {
      this.logger.Error("An unexpected error occurred in ToastmastersService.getAllMembers ...");
      this.logger.Error(error);
      return <IGetAllMembersResponse>{ clubMembers: [] };
    }
  }
  
  /**
   * Get all club officers
   * @returns Club officers
   */
   public async getAllClubOfficers(): Promise<IGetAllClubOfficersResponse> {
    try {
      this.logger.Info("getAllClubOfficers Start");

      if (!this._allClubOfficersRespCache) { // Has the response already been cached?
        this._allClubOfficersRespCache = await this.http.get<IGetAllClubOfficersResponse>(this._tmClubDataUri).toPromise();
      }

      return Promise.resolve(ServiceHelper.cloneObject(this._allClubOfficersRespCache));
    } 
    catch (error: any) {
      this.logger.Error("An unexpected error occurred in ToastmastersService.getAllClubOfficers ...");
      this.logger.Error(error);
      return <IGetAllClubOfficersResponse>{ clubOfficers: [] };
    }
  }

  /**
   * Get all club meeting roles
   * @returns club meeting roles
   */
  public async getAllMeetingRoles(): Promise<IGetAllMeetingRolesResponse> {
    try {
      this.logger.Info("getAllMeetingRoles Start");

      if (!this._allMeetingRolesRespCache) { // Has the response already been cached?
        this._allMeetingRolesRespCache = await this.http.get<IGetAllMeetingRolesResponse>(this._tmClubDataUri).toPromise();
      }

      return Promise.resolve(ServiceHelper.cloneObject(this._allMeetingRolesRespCache));
    } 
    catch (error: any) {
      this.logger.Error("An unexpected error occurred in ToastmastersService.getAllMeetingRoles ...");
      this.logger.Error(error);
      return <IGetAllMeetingRolesResponse>{meetingRoles: []};
    }
  }

  /**
   * Get meeting agenda roles
   * @param autoAssignMembers 
   * @returns Get meeting agenda, optionally auto-assign members to roles
   */
  public async getMeetingAgenda(autoAssignMembers: boolean): Promise<IGetMeetingAgendaResponse> {
    try {
      this.logger.Info("getMeetingAgenda Start");
      let meetingAgenda: IGetMeetingAgendaResponse = <IGetMeetingAgendaResponse>{roles: []};

      this.logger.Info("Fetching club roles list ...");
      const roles: IMeetingRoleResponse[] = (await this.getAllMeetingRoles())?.meetingRoles;

      if (roles && roles.length > 0) {
        this.logger.Info(`Found ${roles.length} meeting roles`);
      }
      else {
        this.logger.Error(`Found 0 meeting roles`);
        return <IGetMeetingAgendaResponse>{};
      }

      //
      // Auto assign members to roles
      //
      if (autoAssignMembers) {
        this.logger.Info("Allocating members to roles ...");
        meetingAgenda = await this.allocateMembersToRoles(roles);
      }

      //
      // Do NOT auto assign members to roles
      //
      else {
        for (const role of roles) {
          const memberName = "";
          meetingAgenda.roles.push(<IMeetingAgendaItemResponse>{
            roleName: role.roleName,
            durationSecondsGreen: role.durationSecondsGreen,
            durationSecondsAmber: role.durationSecondsAmber,
            durationSecondsRed: role.durationSecondsRed,
            memberName: memberName
          })
        }
      }

      return meetingAgenda;
    } 
    catch (error: any) {
      this.logger.Error("An unexpected error occurred in ToastmastersService.getMeetingAgenda ...");
      this.logger.Error(error);
      return <IGetMeetingAgendaResponse>{};
    }
  }

  /**
   * Auto assign Club Members to Roles
   * @param roles 
   */
  private async allocateMembersToRoles(roles: IMeetingRoleResponse[]): Promise<IGetMeetingAgendaResponse> {
    let meetingAgenda: IGetMeetingAgendaResponse = <IGetMeetingAgendaResponse>{roles: []};
    
    this.logger.Info("Fetching club members list ...");
    let members = (await this.getAllMembers())?.clubMembers;
  
    if (members && members.length > 0) {
      this.logger.Info(`Found ${members.length} club members`);
    }
    else {
      this.logger.Error(`Found 0 club members`);
      return <IGetMeetingAgendaResponse>{};
    }
  
    // Randomly shuffle the order
    members = new CollectionsHelper<IMemberResponse>().shuffleArray(members);
    //
    
    this.logger.Info("Populating meeting agenda ...");
    for (const role of roles) {
      if (members.length == 0) {
        // All members have already been allocated a role, assign multiple roles 
        // to some members to fill the remaining roles
        this.logger.Warning("There are more meeting roles than available members, some members will be assigned additional roles");
        
        members = (await this.getAllMembers())?.clubMembers;
        
        // Randomly shuffle the order
        members = new CollectionsHelper<IMemberResponse>().shuffleArray(members);
      }
      
      const memberName = members.length > 0 ? members.pop()?.name : "";
  
      meetingAgenda.roles.push(<IMeetingAgendaItemResponse>{ 
        roleName: role.roleName,
        durationSecondsGreen: role.durationSecondsGreen,
        durationSecondsAmber: role.durationSecondsAmber,
        durationSecondsRed: role.durationSecondsRed,
        memberName: memberName
      });
    }

    return meetingAgenda;
  }
}


//
// Interfaces
//
export interface IGetAllClubDetailsResponse {
  clubName: string;
  clubMeetingSchedule: string;
  clubMissionStatement: string;
  clubWebsiteUrl: string;
}

export interface IMemberResponse {
  name: string;
}
export interface IGetAllMembersResponse {
  clubMembers: IMemberResponse[];
}

export interface IClubOfficerResponse {
  roleName: string;
  memberName: string;
}
export interface IGetAllClubOfficersResponse {
  clubOfficers: IClubOfficerResponse[];
}

export interface IMeetingRoleResponse {
  roleName: string;
  durationSecondsGreen: number | null;
  durationSecondsAmber: number | null;
  durationSecondsRed: number | null;
}

export interface IGetAllMeetingRolesResponse {
  meetingRoles: IMeetingRoleResponse[];
}

export interface IMeetingAgendaItemResponse {
  roleName: string;
  durationSecondsGreen: number | null;
  durationSecondsAmber: number | null;
  durationSecondsRed: number | null;
  memberName: string;
}
export interface IGetMeetingAgendaResponse {
  roles: IMeetingAgendaItemResponse[];
}
//