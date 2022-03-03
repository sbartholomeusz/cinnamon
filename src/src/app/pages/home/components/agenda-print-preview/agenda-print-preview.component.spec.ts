import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ValidationHelper } from 'src/app/common/helpers/validations/validation-helper';
import { QrCodeGeneratorService } from 'src/app/services/qr-code-generator.service';
import { IGetAllClubDetailsResponse, IGetAllClubOfficersResponse, ToastmastersService } from 'src/app/services/toastmasters.service';

import { AgendaPrintPreviewComponent } from './agenda-print-preview.component';

describe('AgendaPrintPreviewComponent', () => {
  let component: AgendaPrintPreviewComponent;
  let fixture: ComponentFixture<AgendaPrintPreviewComponent>;
  let tmService: ToastmastersService;
  let qrCodeSvc: QrCodeGeneratorService;
  let httptestCtl: HttpTestingController;
  let dataUriStringMatch: string = 'data:image/png';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ AgendaPrintPreviewComponent ], 
      providers: [
        ToastmastersService,
        QrCodeGeneratorService,
        ValidationHelper
      ]
    })
    .compileComponents();    
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaPrintPreviewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges(); // Perform data bindings

    tmService = TestBed.inject(ToastmastersService);
    qrCodeSvc = TestBed.inject(QrCodeGeneratorService);
    httptestCtl = TestBed.inject(HttpTestingController);
  });

  /* -------------------------------------------------------------- */

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  //
  // *** Club Information ***
  //

  it('should show 0 officers on meeting agenda', fakeAsync(() => {
    const mockGetAllClubDetailsResp: IGetAllClubDetailsResponse = {
      clubName: "Unicorn Toastmasters",
      clubMeetingSchedule: "1st, 3rd Wed of every month @ 06:00pm",
      clubMissionStatement: "We provide a supportive and positive learning experience in which members are empowered to develop communication and leadership skills, resulting in greater self-confidence and personal growth.",
      clubWebsiteUrl: "https://www.toastmasters.org"
    }
    spyOn(tmService, 'getAllClubDetails').and.returnValue(Promise.resolve(mockGetAllClubDetailsResp));

    const mockGetAllClubOfficersResp: IGetAllClubOfficersResponse = {
      clubOfficers: []
    }
    spyOn(tmService, 'getAllClubOfficers').and.returnValue(Promise.resolve(mockGetAllClubOfficersResp));

    component.ngOnInit();
    tick();
    fixture.detectChanges(); // Perform data bindings
    flush();

    const clubName = mockGetAllClubDetailsResp.clubName;
    const clubMeetingSchedule = mockGetAllClubDetailsResp.clubMeetingSchedule;
    const clubMissionStatement = mockGetAllClubDetailsResp.clubMissionStatement;
    expect(component).toBeDefined();
    expect(component.clubDetails).toBeDefined();
    expect(component.clubDetails.clubName).toBe(clubName);
    expect(component.clubDetails.clubMeetingSchedule).toBe(clubMeetingSchedule);
    expect(component.clubDetails.clubMissionStatement).toBe(clubMissionStatement);
    expect(component.clubOfficers).toBeDefined();
    expect(component.clubOfficers.length).toBe(0);
    expect(fixture.debugElement.queryAll(By.css('.club-information .club-officer')).length).toBe(0);
  }));

  /* -------------------------------------------------------------- */

  it('should show 1 officer on meeting agenda with qr code', fakeAsync(() => {
    // First web request
    const mockGetAllClubDetailsResp: IGetAllClubDetailsResponse = {
      clubName: "Unicorn Toastmasters",
      clubMeetingSchedule: "1st, 3rd Wed of every month @ 06:00pm",
      clubMissionStatement: "We provide a supportive and positive learning experience in which members are empowered to develop communication and leadership skills, resulting in greater self-confidence and personal growth.",
      clubWebsiteUrl: "https://www.toastmasters.org"  // QR code required
    }
    spyOn(tmService, 'getAllClubDetails').and.returnValue(Promise.resolve(mockGetAllClubDetailsResp));

    // Second web request
    const mockQrCodeResp: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
    spyOn(qrCodeSvc, 'getQRCodeDataUri').and.returnValue(Promise.resolve(mockQrCodeResp));

    // Third web request
    const mockGetAllClubOfficersResp: IGetAllClubOfficersResponse = {
      clubOfficers: [{memberName: "Tom Ato", roleName: "Toastmaster"}]
    }
    spyOn(tmService, 'getAllClubOfficers').and.returnValue(Promise.resolve(mockGetAllClubOfficersResp));

    component.ngOnInit();
    tick();
    fixture.detectChanges(); // Perform data bindings
    flush();

    const clubName = mockGetAllClubDetailsResp.clubName;
    const clubMeetingSchedule = mockGetAllClubDetailsResp.clubMeetingSchedule;
    const clubMissionStatement = mockGetAllClubDetailsResp.clubMissionStatement;
    const officerName = mockGetAllClubOfficersResp.clubOfficers[0].memberName;
    const role = mockGetAllClubOfficersResp.clubOfficers[0].roleName;
    expect(component).toBeDefined();
    expect(component.clubDetails).toBeDefined();
    expect(component.clubDetails.clubName).toBe(clubName);
    expect(component.clubDetails.clubMeetingSchedule).toBe(clubMeetingSchedule);
    expect(component.clubDetails.clubMissionStatement).toBe(clubMissionStatement);
    expect(component.clubOfficers).toBeDefined();
    expect(component.clubOfficers.length).toBe(1);
    expect(component.clubOfficers[0]).toBe(mockGetAllClubOfficersResp.clubOfficers[0]);

    const clubOfficerElements: DebugElement[] = fixture.debugElement.queryAll(By.css('.club-information .club-officer'));
    expect(clubOfficerElements.length).toBe(1);
    expect(clubOfficerElements[0].nativeElement.innerText.includes(officerName)).toBeTruthy();
    expect(clubOfficerElements[0].nativeElement.innerText.includes(role)).toBeTruthy();

    // Check QR code found in component properties
    expect(component.tmWebsiteQrCode).toBeDefined();
    expect(component.tmWebsiteQrCode).toContain(dataUriStringMatch);

    // Check QR code found in component properties
    const qrCodeElement: DebugElement = fixture.debugElement.query(By.css('.qr-code'));
    expect(qrCodeElement).toBeTruthy();
    expect(qrCodeElement.nativeElement).toBeTruthy();
    expect(qrCodeElement.nativeElement.getAttribute('src')).toContain(dataUriStringMatch);
  }));

  /* -------------------------------------------------------------- */

  it('should show 1 officer on meeting agenda without qr code', fakeAsync(() => {
    // First web request
    const mockGetAllClubDetailsResp: IGetAllClubDetailsResponse = { // Supply empty details
      clubName: "Unicorn Toastmasters",
      clubMeetingSchedule: "1st, 3rd Wed of every month @ 06:00pm",
      clubMissionStatement: "We provide a supportive and positive learning experience in which members are empowered to develop communication and leadership skills, resulting in greater self-confidence and personal growth.",
      clubWebsiteUrl: "" // No QR code
    }
    spyOn(tmService, 'getAllClubDetails').and.returnValue(Promise.resolve(mockGetAllClubDetailsResp));

    // Second web request
    const mockGetAllClubOfficersResp: IGetAllClubOfficersResponse = {
      clubOfficers: [{memberName: "Tom Ato", roleName: "Toastmaster"}]
    }
    spyOn(tmService, 'getAllClubOfficers').and.returnValue(Promise.resolve(mockGetAllClubOfficersResp));

    component.ngOnInit();
    tick();
    fixture.detectChanges(); // Perform data bindings
    flush();

    // Check officer found in component properties
    const clubName = mockGetAllClubDetailsResp.clubName;
    const clubMeetingSchedule = mockGetAllClubDetailsResp.clubMeetingSchedule;
    const clubMissionStatement = mockGetAllClubDetailsResp.clubMissionStatement;
    const officerName = mockGetAllClubOfficersResp.clubOfficers[0].memberName;
    const role = mockGetAllClubOfficersResp.clubOfficers[0].roleName;
    expect(component).toBeDefined();
    expect(component.clubDetails).toBeDefined();
    expect(component.clubDetails.clubName).toBe(clubName);
    expect(component.clubDetails.clubMeetingSchedule).toBe(clubMeetingSchedule);
    expect(component.clubDetails.clubMissionStatement).toBe(clubMissionStatement);
    expect(component.clubOfficers).toBeDefined();
    expect(component.clubOfficers.length).toBe(1);
    expect(component.clubOfficers[0]).toBe(mockGetAllClubOfficersResp.clubOfficers[0]);

    // Check officer found in HTML
    const clubOfficerElements: DebugElement[] = fixture.debugElement.queryAll(By.css('.club-information .club-officer'));
    expect(clubOfficerElements.length).toBe(1);
    expect(clubOfficerElements[0].nativeElement.innerText.includes(officerName)).toBeTruthy();
    expect(clubOfficerElements[0].nativeElement.innerText.includes(role)).toBeTruthy();

    // Check QR code found in component properties
    expect(component.tmWebsiteQrCode).toBeDefined();
    expect(component.tmWebsiteQrCode).not.toContain(dataUriStringMatch);

    // Check QR code found in component properties
    const qrCodeElement: DebugElement = fixture.debugElement.query(By.css('.qr-code'));
    expect(qrCodeElement).toBeTruthy();
    expect(qrCodeElement.nativeElement).toBeTruthy();
    expect(qrCodeElement.nativeElement.getAttribute('src')).not.toContain(dataUriStringMatch);
  }));


  //
  // *** Meeting Agenda Details ***
  //

  it('should show meeting agenda', fakeAsync(() => {
    component.meetingNumber = 1;
    component.meetingDate = new Date(2000, 1, 1, 16, 0, 0, 0);
    component.meetingAgenda = [
      {id: 1, memberName: "Tom Ato", roleName: "Sergeant-At-Arms", durationSecondsGreen: 60, durationSecondsAmber: 90, durationSecondsRed: 120, startTime: new Date(2000, 1, 1, 16, 0, 0, 0)},
      {id: 2, memberName: "Caesar Salad", roleName: "President's Open", durationSecondsGreen: 60, durationSecondsAmber: 90, durationSecondsRed: 120, startTime: new Date(2000, 1, 1, 16, 1, 0, 0)},
      {id: 3, memberName: "Russell Sprouts", roleName: "Toastmaster's Introduction", durationSecondsGreen: 30, durationSecondsAmber: 45, durationSecondsRed: 60, startTime: new Date(2000, 1, 1, 16, 2, 0, 0)}
    ]

    // First web request
    const mockGetAllClubDetailsResp: IGetAllClubDetailsResponse = { // Supply empty details
      clubName: "Unicorn Toastmasters",
      clubMeetingSchedule: "1st, 3rd Wed of every month @ 06:00pm",
      clubMissionStatement: "We provide a supportive and positive learning experience in which members are empowered to develop communication and leadership skills, resulting in greater self-confidence and personal growth.",
      clubWebsiteUrl: "" // No QR code
    }
    spyOn(tmService, 'getAllClubDetails').and.returnValue(Promise.resolve(mockGetAllClubDetailsResp));

    // Second web request
    const mockGetAllClubOfficersResp: IGetAllClubOfficersResponse = {
      clubOfficers: [{memberName: "Tom Ato", roleName: "Toastmaster"}]
    }
    spyOn(tmService, 'getAllClubOfficers').and.returnValue(Promise.resolve(mockGetAllClubOfficersResp));

    component.ngOnInit();
    tick();
    fixture.detectChanges(); // Perform data bindings
    flush();
    tick();

    // Check meeting number is shown
    const meetingNumber: string = fixture.debugElement.query(By.css('.club-information .meeting-number')).nativeElement.innerText;
    expect(meetingNumber).toBeTruthy();
    expect(meetingNumber.length).toBeGreaterThan(0);

    const isMeetingNumber = /^Meeting \d{3}$/.test(meetingNumber);
    expect(isMeetingNumber).toBeTrue();
    //

    // Check meeting date is shown
    const meetingDate: string = fixture.debugElement.query(By.css('.club-information .meeting-date')).nativeElement.innerText;
    expect(meetingDate).toBeTruthy();
    expect(meetingDate.length).toBeGreaterThan(0); // TODO: Do proper date validation
    //
    
    // Validate details in the meeting agenda table
    // Should be 4 rows = 1 header + 3 agenda line items
    const meetingAgendaRows: DebugElement[] = fixture.debugElement.queryAll(By.css('.meeting-roles > table > tr'));
    expect(meetingAgendaRows.length).toBe(4);

    // Ensure each cell is populated
    const meetingAgendaCells: DebugElement[] = fixture.debugElement.queryAll(By.css('.meeting-roles > table > tr > td'));
    expect(meetingAgendaCells.length).toBe(3 * 6);
    for (const cell of meetingAgendaCells) {
      expect(cell.nativeElement.innerText.length).toBeGreaterThan(0);
    }
  }));
});
