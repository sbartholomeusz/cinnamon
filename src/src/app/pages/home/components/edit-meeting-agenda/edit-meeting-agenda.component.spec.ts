import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { IMeetingAgendaLineItem } from 'src/app/common/model/IMeetingAgendaLineItem';
import { ApplicationConfigurationService } from 'src/app/services/app-configuration.service';
import { IGetAllMeetingRolesResponse, IGetAllMembersResponse, IGetMeetingAgendaResponse, IMeetingAgendaItemResponse, ToastmastersService } from 'src/app/services/toastmasters.service';

import { EditMeetingAgendaComponent } from './edit-meeting-agenda.component';

describe('EditMeetingAgendaComponent', () => {
  let component: EditMeetingAgendaComponent;
  let fixture: ComponentFixture<EditMeetingAgendaComponent>;
  let tmService: ToastmastersService;
  let httptestCtl: HttpTestingController;
  let config: ApplicationConfigurationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMeetingAgendaComponent ],
      imports: [HttpClientTestingModule],
      providers: [
        ToastmastersService,
        HttpClient,
        ApplicationConfigurationService
      ]
    })
    .compileComponents();

    config = TestBed.inject(ApplicationConfigurationService);
    httptestCtl = TestBed.inject(HttpTestingController);
    tmService = TestBed.inject(ToastmastersService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMeetingAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Should be no more pending requests
    // Wait for async requests to complete
    setTimeout(() => {httptestCtl.verify()}, 5000);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate the meeting start times', fakeAsync(() => {
    const meetingStartTime: Date = new Date(2000, 1, 1, 16, 0, 0, 0);
    let meetingAgenda: IMeetingAgendaLineItem[] = [  // three speakers in agenda
      {id: 1, memberName: "Tom Ato", roleName: "Sergeant-At-Arms", durationSecondsGreen: 0, durationSecondsAmber: 0, durationSecondsRed: 60, startTime: null},
      {id: 2, memberName: "Caesar Salad", roleName: "President's Open", durationSecondsGreen: 0, durationSecondsAmber: 0, durationSecondsRed: 60, startTime: null},
      {id: 3, memberName: "Russell Sprouts", roleName: "Toastmaster's Introduction", durationSecondsGreen: 0, durationSecondsAmber: 0, durationSecondsRed: 60, startTime: null},
    ];
    let mockAgendaResp: IMeetingAgendaItemResponse[] = [  // three speakers in agenda
      {memberName: "Tom Ato", roleName: "Sergeant-At-Arms", durationSecondsGreen: 0, durationSecondsAmber: 0, durationSecondsRed: 60},
      {memberName: "Caesar Salad", roleName: "President's Open", durationSecondsGreen: 0, durationSecondsAmber: 0, durationSecondsRed: 60},
      {memberName: "Russell Sprouts", roleName: "Toastmaster's Introduction", durationSecondsGreen: 0, durationSecondsAmber: 0, durationSecondsRed: 60},
    ];

    // First web request
    const mockMembersResp: IGetAllMembersResponse = {clubMembers: [
      {name: "Tom Ato"}, 
      {name: "Caesar Salad"}
    ]};
    spyOn(tmService, 'getAllMembers').and.returnValue(Promise.resolve(mockMembersResp));

    // Second web request
    spyOn(tmService, 'getMeetingAgenda').and.returnValue(Promise.resolve({roles: mockAgendaResp}));

    component.ngOnInit();
    tick();
    fixture.detectChanges(); // Perform data bindings
    flush();

    component.recalcAgendaStartTimes(meetingStartTime, meetingAgenda).then((result) => {
      meetingAgenda = result
    });
    tick();

    // First speaker
    const expectedMeetingStartTime1: Date = new Date(2000, 1, 1, 16, 0, 0, 0)

    // Second speaker
    const expectedMeetingStartTime2: Date = new Date(2000, 1, 1, 16, 0, 0, 0);
    const speakerDuration2: number = meetingAgenda[0]?.durationSecondsRed ? meetingAgenda[0]?.durationSecondsRed : 0;
    expectedMeetingStartTime2.setSeconds(expectedMeetingStartTime2.getSeconds() + speakerDuration2);

    // Third speaker
    const expectedMeetingStartTime3: Date = new Date(expectedMeetingStartTime2.getFullYear(), expectedMeetingStartTime2.getMonth(), expectedMeetingStartTime2.getDate(), expectedMeetingStartTime2.getHours(), expectedMeetingStartTime2.getMinutes(), expectedMeetingStartTime2.getSeconds(), expectedMeetingStartTime2.getMilliseconds());
    const speakerDuration3: number = meetingAgenda[0]?.durationSecondsRed ? meetingAgenda[0]?.durationSecondsRed : 0;
    expectedMeetingStartTime3.setSeconds(expectedMeetingStartTime3.getSeconds() + speakerDuration3);

    // Fetch configuration
    const configs = config.getAllConfigurations();
    tick();

    expect(meetingAgenda.length).toBe(3);

    // Validate meeting segment start times
    expect(meetingAgenda[0]?.startTime).toBeTruthy();
    expect(meetingAgenda[0]?.startTime).toEqual(expectedMeetingStartTime1);
    expect(meetingAgenda[1]?.startTime).toBeTruthy();
    expect(meetingAgenda[1]?.startTime).toEqual(expectedMeetingStartTime2);
    expect(meetingAgenda[2]?.startTime).toBeTruthy();
    expect(meetingAgenda[2]?.startTime).toEqual(expectedMeetingStartTime3);

    // Validate members list
    expect(component.clubMembersList.length).toBe(mockMembersResp.clubMembers.length);

    // Query All Club Member details and Meeting Agenda details
    var requests = httptestCtl.match(configs.tmClubDatasUrl);
    expect(requests.length).toBe(2);
  }));


  //
  // *** Traffic Light Input Validation Routines ***
  //

  it('should return durationSecondsRed as Green Light max value', () => {
    const agendaItems: IMeetingAgendaLineItem = {
      id: 1,
      memberName: '',
      roleName: '',
      startTime: null,
      durationSecondsGreen: 1,
      durationSecondsAmber: 2,
      durationSecondsRed: 3
    }
    const result = component.getGreenMaxValue(agendaItems);

    expect(result).toBeTruthy();
    expect(result).toBe(agendaItems.durationSecondsRed);
  });

  /* -------------------------------------------------------------- */

  it('should return durationSecondsAmber as Green Light max value', () => {
    const agendaItems: IMeetingAgendaLineItem = {
      id: 1,
      memberName: '',
      roleName: '',
      startTime: null,
      durationSecondsGreen: 1,
      durationSecondsAmber: 2,
      durationSecondsRed: null
    }
    const result = component.getGreenMaxValue(agendaItems);

    expect(result).toBeTruthy();
    expect(result).toBe(agendaItems.durationSecondsAmber);
  });

  /* -------------------------------------------------------------- */

  it('should return durationSecondsGreen as Amber Light min value', () => {
    const agendaItems: IMeetingAgendaLineItem = {
      id: 1,
      memberName: '',
      roleName: '',
      startTime: null,
      durationSecondsGreen: 1,
      durationSecondsAmber: 2,
      durationSecondsRed: 3
    }
    const result = component.getAmberMinValue(agendaItems);

    expect(result).toBeTruthy();
    expect(result).toBe(agendaItems.durationSecondsGreen);
  });

  /* -------------------------------------------------------------- */

  it('should return durationSecondsRed as Amber Light max value', () => {
    const agendaItems: IMeetingAgendaLineItem = {
      id: 1,
      memberName: '',
      roleName: '',
      startTime: null,
      durationSecondsGreen: 1,
      durationSecondsAmber: 2,
      durationSecondsRed: 3
    }
    const result = component.getAmberMaxValue(agendaItems);

    expect(result).toBeTruthy();
    expect(result).toBe(agendaItems.durationSecondsRed);
  });

  /* -------------------------------------------------------------- */

  it('should return null as Amber Light max value', () => {
    const agendaItems: IMeetingAgendaLineItem = {
      id: 1,
      memberName: '',
      roleName: '',
      startTime: null,
      durationSecondsGreen: 1,
      durationSecondsAmber: 2,
      durationSecondsRed: null   // not specified
    }
    const result = component.getAmberMaxValue(agendaItems);

    expect(result).toBeDefined();
    expect(result).toBeNull();
  });

  /* -------------------------------------------------------------- */

  it('should return durationSecondsAmber as Red Light min value', () => {
    const agendaItems: IMeetingAgendaLineItem = {
      id: 1,
      memberName: '',
      roleName: '',
      startTime: null,
      durationSecondsGreen: 1,
      durationSecondsAmber: 2,
      durationSecondsRed: 3
    }
    const result = component.getRedMinValue(agendaItems);

    expect(result).toBeTruthy();
    expect(result).toBe(agendaItems.durationSecondsAmber);
  });

  /* -------------------------------------------------------------- */

  it('should return durationSecondsGreen as Red Light min value', () => {
    const agendaItems: IMeetingAgendaLineItem = {
      id: 1,
      memberName: '',
      roleName: '',
      startTime: null,
      durationSecondsGreen: 1,
      durationSecondsAmber: null,  // Not specified
      durationSecondsRed: 3
    }
    const result = component.getRedMinValue(agendaItems);

    expect(result).toBeTruthy();
    expect(result).toBe(agendaItems.durationSecondsGreen);
  });
});
