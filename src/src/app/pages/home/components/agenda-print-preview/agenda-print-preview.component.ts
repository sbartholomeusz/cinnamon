import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ValidationHelper } from 'src/app/common/helpers/validations/validation-helper';
import { IMeetingAgendaLineItem } from 'src/app/common/model/IMeetingAgendaLineItem';
import { LoggingService } from 'src/app/services/logging.service';
import { QrCodeGeneratorService } from 'src/app/services/qr-code-generator.service';
import { IClubOfficerResponse, IGetAllClubDetailsResponse, ToastmastersService } from 'src/app/services/toastmasters.service';

@Component({
  selector: 'agenda-print-preview',
  templateUrl: './agenda-print-preview.component.html',
  styleUrls: ['./agenda-print-preview.component.scss']
})
export class AgendaPrintPreviewComponent implements OnInit {

 /** 
  * Inputs and outputs
  */
  @Input()
  get meetingNumber() {
    return this._meetingNumber;
  }
  set meetingNumber(value: number) {
    this._meetingNumber = value;
  }

  @Input() 
  get meetingAgenda () {
    return this._meetingAgenda;
  }
  set meetingAgenda (value: IMeetingAgendaLineItem[] | null) {
    this._meetingAgenda = value;
    this.meetingDate = this._meetingAgenda && this._meetingAgenda?.length>0 ? this._meetingAgenda[0].startTime : null;
  };


  /** 
   * Global Variables
   */
  public clubDetails: IGetAllClubDetailsResponse = {clubName: "", clubMeetingSchedule: "", clubMissionStatement: "", clubWebsiteUrl: ""};
  public clubOfficers: IClubOfficerResponse[] = [];
  public tmWebsiteQrCode: string = "";
  public meetingDate: Date | null = null;
  private _meetingNumber: number = 0;
  private _meetingAgenda: IMeetingAgendaLineItem[] | null = [];


  /** 
   * Methods
   */
  constructor(private _logger: LoggingService, private _tmSvc: ToastmastersService, private _qrCodeSvc: QrCodeGeneratorService) { }

  ngOnInit(): void {
    this.initialiseForm();
  }

  private async initialiseForm() : Promise<void> { 
    this._logger.Info("Start initialiseForm");

    try {
      // Assumption: Agenda iterms will be sorted in asc order of time
      this.meetingDate = this._meetingAgenda && this._meetingAgenda?.length > 0 ? this._meetingAgenda[0].startTime : null;

      this._logger.Info("Fetching club details ...");
      await Promise.all([this._tmSvc.getAllClubDetails()]).then(async (results) => {
        this.clubDetails = results[0];

        this._qrCodeSvc.getQRCodeDataUri(this.clubDetails.clubWebsiteUrl).then((dataUrl) => {
          if (ValidationHelper.isValidDataUrl(dataUrl)) {
            this.tmWebsiteQrCode = dataUrl;
          }
        });
      });

      this._logger.Info("Fetching club officers list ...");
      await Promise.all([this._tmSvc.getAllClubOfficers()]).then((results) => {
        this.clubOfficers = results[0]?.clubOfficers;
      });
    }
    catch (error: any) {
      this._logger.Error("An unexpected error occurred in AgendaPrintPreviewComponent.initialiseForm ...");
      this._logger.Error(error);
    }
  }
}
