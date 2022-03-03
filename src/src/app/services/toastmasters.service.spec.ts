import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { IGetAllClubDetailsResponse, IGetAllClubOfficersResponse, IGetAllMeetingRolesResponse, IGetAllMembersResponse, ToastmastersService } from './toastmasters.service';
import { ApplicationConfigurationService, IAppConfiguration } from './app-configuration.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { LoggingService } from './logging.service';

describe('ToastmastersService', () => {
  let tmService: ToastmastersService;
  let config: ApplicationConfigurationService;
  let httptestCtl: HttpTestingController;
  let logger: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ToastmastersService,
        ApplicationConfigurationService,
        HttpClient,
        LoggingService
      ]
    });
    config = TestBed.inject(ApplicationConfigurationService);
    httptestCtl = TestBed.inject(HttpTestingController);
    logger = TestBed.inject(LoggingService);
    tmService = TestBed.inject(ToastmastersService);
  });

  afterEach(() => {
    // Should be no more pending requests
    // Wait for async requests to complete
    setTimeout(() => {httptestCtl.verify()}, 5000);
  });

  /* -------------------------------------------------------------- */

  it('should be created', () => {
    expect(tmService).toBeTruthy();
    expect(config).toBeTruthy();
    expect(logger).toBeTruthy();
  });


  //
  // *** Meeting Roles ***
  //

  it('should return 0 meeting roles', (done: any) => {
    const configs: IAppConfiguration = config.getAllConfigurations();
    const mockRolesResp: IGetAllMeetingRolesResponse = {meetingRoles: []};
    
    tmService.getAllMeetingRoles().then((resp)=> {
      expect(resp).toBeTruthy();
      expect(resp.meetingRoles).toBeTruthy();
      expect(resp.meetingRoles.length).toBe(0);
      done();
    });

    const req = httptestCtl.expectOne(configs.tmClubDatasUrl).flush(mockRolesResp);
  });

  /* -------------------------------------------------------------- */

  it('should return 3 meeting roles', (done: any) => {
    const configs: IAppConfiguration = config.getAllConfigurations();
    const mockRolesResp: IGetAllMeetingRolesResponse = 
      {meetingRoles: [
        {
          roleName: "Sergeant-At-Arms",
          durationSecondsGreen: 60,
          durationSecondsAmber: 90,
          durationSecondsRed: 120
        },
        {
          roleName: "President's Open",
          durationSecondsGreen: null,
          durationSecondsAmber: null,
          durationSecondsRed: 60
        },
        {
          roleName: "Toastmaster's Introduction",
          durationSecondsGreen: 60,
          durationSecondsAmber: 90,
          durationSecondsRed: 120
        }
      ]};
    
    tmService.getAllMeetingRoles().then((resp)=> {
      expect(resp).toBeTruthy();
      expect(resp.meetingRoles).toBeTruthy();
      expect(resp.meetingRoles.length).toBe(3);
      done();
    });

    const req = httptestCtl.expectOne(configs.tmClubDatasUrl).flush(mockRolesResp);
  });


  //
  // *** Club Members ***
  //

  it('should return 2 members', (done: any) => {
    const configs: IAppConfiguration = config.getAllConfigurations();
    const mockAllMembersResp: IGetAllMembersResponse = {clubMembers: [{name: "John Smith"}, {name: "Alan Jones"}]}

    tmService.getAllMembers().then((resp)=> {
      expect(resp).toBeTruthy();
      expect(resp.clubMembers).toBeTruthy();
      expect(resp.clubMembers.length).toBe(2);
      done();
    });

    //const req = httptestCtl.expectOne(request => { console.log(request.url); return true;});
    const req = httptestCtl.expectOne(configs.tmClubDatasUrl).flush(mockAllMembersResp);
  });

  /* -------------------------------------------------------------- */

  it('should return 0 members', (done: any) => {
    const configs: IAppConfiguration = config.getAllConfigurations();
    const mockAllMembersResp: IGetAllMembersResponse = {clubMembers: []}

    tmService.getAllMembers().then((resp)=> {
      expect(resp).toBeTruthy();
      expect(resp.clubMembers).toBeTruthy();
      expect(resp.clubMembers.length).toBe(0);
      done();
    });

    //const req = httptestCtl.expectOne(request => { console.log(request.url); return true;});
    const req = httptestCtl.expectOne(configs.tmClubDatasUrl).flush(mockAllMembersResp);
  });


  //
  // *** Club Officer Details ***
  //

  it('should return 0 club officers', fakeAsync(() => {
    const mockOfficersResp: IGetAllClubOfficersResponse = 
    {
      clubOfficers: []
    };
    const configs: IAppConfiguration = config.getAllConfigurations();

    let officersResp: any;
    tmService.getAllClubOfficers().then((resp) => {
      officersResp = resp;
    });
    
    //const req = httptestCtl.expectOne(request => { console.log(request.url); return true;});
    httptestCtl.expectOne({method: 'GET', url: configs.tmClubDatasUrl}).flush(mockOfficersResp);
    tick();

    httptestCtl.verify();
    expect(officersResp).toBeTruthy();
    expect(officersResp.clubOfficers).toBeTruthy();
    expect(officersResp.clubOfficers.length).toBe(0);
  }));

  /* -------------------------------------------------------------- */

  it('should return 3 club officers', fakeAsync(() => {
    const mockOfficersResp: IGetAllClubOfficersResponse = 
    {
      clubOfficers: [
        {
            roleName: "Club President",
            memberName: "Tom Ato"
        }, 
        {
            roleName: "VP Education",
            memberName: "Caesar Salad"
        }, 
        {
            roleName: "VP Membership",
            memberName: "Russell Sprouts"
        }
      ]
    };
    const configs: IAppConfiguration = config.getAllConfigurations();

    let officersResp: any;
    tmService.getAllClubOfficers().then((resp) => {
      officersResp = resp;
    });
    
    //const req = httptestCtl.expectOne(request => { console.log(request.url); return true;});
    httptestCtl.expectOne({method: 'GET', url: configs.tmClubDatasUrl}).flush(mockOfficersResp);
    tick();

    expect(officersResp).toBeTruthy();
    expect(officersResp.clubOfficers).toBeTruthy();
    expect(officersResp.clubOfficers.length).toBe(3);
  }));


  //
  // *** Meeting Agenda ***
  //

  it('should auto assign all members to all meeting roles', fakeAsync(() => {
    const autoAssignMembers: boolean = true;
    const mockMembersResp: IGetAllMembersResponse = {clubMembers: [{name: "John Smith"}, {name: "Alan Jones"}]};
    const mockRolesResp: IGetAllMeetingRolesResponse = 
      {
        meetingRoles: [
          {
            roleName: "Sergeant-At-Arms",
            durationSecondsGreen: 60,
            durationSecondsAmber: 90,
            durationSecondsRed: 120
          },
          {
            roleName: "President's Open",
            durationSecondsGreen: null,
            durationSecondsAmber: null,
            durationSecondsRed: 60
          },
          {
            roleName: "Toastmaster's Introduction",
            durationSecondsGreen: 60,
            durationSecondsAmber: 90,
            durationSecondsRed: 120
          }
      ]};
    const configs: IAppConfiguration = config.getAllConfigurations();

    let agendaResp: any;
    tmService.getMeetingAgenda(autoAssignMembers).then((resp) => {
      agendaResp = resp;
    });

    httptestCtl.expectOne({method: 'GET', url: configs.tmClubDatasUrl}).flush(mockRolesResp);
    tick();
    httptestCtl.expectOne({method: 'GET', url: configs.tmClubDatasUrl}).flush(mockMembersResp);
    tick();
    // Note: second request to GetAllMembers request will be cached

    expect(agendaResp).toBeTruthy();
    expect(agendaResp.roles).toBeTruthy();
    expect(agendaResp.roles.length == 3).toBeTruthy();

    for (const role of agendaResp.roles) {
      expect(role.roleName).toBeTruthy();
      expect(role.roleName).not.toEqual("");
      expect(role.memberName).toBeTruthy();
      expect(role.memberName).not.toEqual("");
    }
  }));

  /* -------------------------------------------------------------- */

  it('should NOT auto assign all members to all meeting roles', fakeAsync(() => {
    const autoAssignMembers: boolean = false;
    const mockRolesResp: IGetAllMeetingRolesResponse = 
      {
        meetingRoles: [
          {
            roleName: "Sergeant-At-Arms",
            durationSecondsGreen: 60,
            durationSecondsAmber: 90,
            durationSecondsRed: 120
          },
          {
            roleName: "President's Open",
            durationSecondsGreen: null,
            durationSecondsAmber: null,
            durationSecondsRed: 60
          },
          {
            roleName: "Toastmaster's Introduction",
            durationSecondsGreen: 60,
            durationSecondsAmber: 90,
            durationSecondsRed: 120
          }
      ]};
    const configs: IAppConfiguration = config.getAllConfigurations();

    let agendaResp: any;
    tmService.getMeetingAgenda(autoAssignMembers).then((resp) => {
      agendaResp = resp;
    });

    httptestCtl.expectOne({method: 'GET', url: configs.tmClubDatasUrl}).flush(mockRolesResp);
    tick();

    expect(agendaResp).toBeTruthy();
    expect(agendaResp.roles).toBeTruthy();
    expect(agendaResp.roles.length).toBe(3);

    for (const role of agendaResp.roles) {
      expect(role.roleName).toBeTruthy();
      expect(role.roleName).not.toEqual("");
      expect(role.memberName).toBeDefined();
      expect(role.memberName).toEqual("");
    }
  }));

  /* -------------------------------------------------------------- */

  it('should auto allocate multiple roles to single club member', fakeAsync(() => {
    const autoAssignMembers: boolean = true;    
    const mockMembersResp: IGetAllMembersResponse = {clubMembers: [{name: "John Smith"}]};
    const mockRolesResp: IGetAllMeetingRolesResponse = 
      {
        meetingRoles: [
          {
            roleName: "Sergeant-At-Arms",
            durationSecondsGreen: 60,
            durationSecondsAmber: 90,
            durationSecondsRed: 120
          },
          {
            roleName: "President's Open",
            durationSecondsGreen: null,
            durationSecondsAmber: null,
            durationSecondsRed: 60
          },
          {
            roleName: "Toastmaster's Introduction",
            durationSecondsGreen: 60,
            durationSecondsAmber: 90,
            durationSecondsRed: 120
          }
      ]};
    const configs: IAppConfiguration = config.getAllConfigurations();

    let agendaResp: any;
    tmService.getMeetingAgenda(autoAssignMembers).then((resp) => {
      agendaResp = resp;
    });

    httptestCtl.expectOne({method: 'GET', url: configs.tmClubDatasUrl}).flush(mockRolesResp);
    tick();
    httptestCtl.expectOne({method: 'GET', url: configs.tmClubDatasUrl}).flush(mockMembersResp);
    tick();
    // Note: Additional 2 requests will use cached data

    expect(agendaResp).toBeTruthy();
    expect(agendaResp.roles).toBeTruthy();
    expect(agendaResp.roles.length == 3).toBeTruthy();

    for (const role of agendaResp.roles) {
      expect(role.roleName).toBeTruthy();
      expect(role.roleName).not.toEqual("");
      expect(role.memberName).toBeTruthy();
      expect(role.memberName).toBe("John Smith");
    }
  }));

  /* -------------------------------------------------------------- */

  it('should NOT auto allocate multiple roles to single member', fakeAsync(() => {
    const autoAssignMembers: boolean = false;    
    const mockRolesResp: IGetAllMeetingRolesResponse = 
      {
        meetingRoles: [
          {
            roleName: "Sergeant-At-Arms",
            durationSecondsGreen: 60,
            durationSecondsAmber: 90,
            durationSecondsRed: 120
          },
          {
            roleName: "President's Open",
            durationSecondsGreen: null,
            durationSecondsAmber: null,
            durationSecondsRed: 60
          },
          {
            roleName: "Toastmaster's Introduction",
            durationSecondsGreen: 60,
            durationSecondsAmber: 90,
            durationSecondsRed: 120
          }
      ]};
    const configs: IAppConfiguration = config.getAllConfigurations();

    let agendaResp: any;
    tmService.getMeetingAgenda(autoAssignMembers).then((resp) => {
      agendaResp = resp;
    });

    httptestCtl.expectOne({method: 'GET', url: configs.tmClubDatasUrl}).flush(mockRolesResp);
    tick();

    expect(agendaResp).toBeTruthy();
    expect(agendaResp.roles).toBeTruthy();
    expect(agendaResp.roles.length).toBe(3);

    for (const role of agendaResp.roles) {
      expect(role.roleName).toBeTruthy();
      expect(role.roleName).not.toEqual("");
      expect(role.memberName).toBeDefined();
      expect(role.memberName).toEqual("");
    }
  }));


  //
  // *** Club Details ***
  //

  it('should return club details', fakeAsync(() => {
    const mockResp: IGetAllClubDetailsResponse = 
      {
        clubName: "Unicorn Toastmasters",
        clubMeetingSchedule: "1st, 3rd Wed of every month @ 06:00pm",
        clubMissionStatement: "We provide a supportive and positive learning experience in which members are empowered to develop communication and leadership skills, resulting in greater self-confidence and personal growth.",
        clubWebsiteUrl: "https://www.toastmasters.org/"
      };
    const configs: IAppConfiguration = config.getAllConfigurations();

    let clubDetailsResp: any;
    tmService.getAllClubDetails().then((resp) => {
      clubDetailsResp = resp;
    });

    httptestCtl.expectOne({method: 'GET', url: configs.tmClubDatasUrl}).flush(mockResp);
    tick();

    expect(clubDetailsResp).toBeTruthy();
    expect(clubDetailsResp.clubName).toBe(mockResp.clubName);
    expect(clubDetailsResp.clubMeetingSchedule).toBe(mockResp.clubMeetingSchedule);
    expect(clubDetailsResp.clubMissionStatement).toBe(mockResp.clubMissionStatement);
    expect(clubDetailsResp.clubWebsiteUrl).toBe(mockResp.clubWebsiteUrl);
  }));
});

