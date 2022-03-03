import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { meetingNumberValidator } from 'src/app/common/custom-validators/meeting-number-validator';
import { IMeetingAgendaLineItem } from 'src/app/common/model/IMeetingAgendaLineItem';
import { PrinterService } from 'src/app/services/printer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  /** 
   * Global Variables
   */
  public _meetingDetailsFormGroup!: FormGroup;
  public _meetingRolesFormGroup!: FormGroup;
  public _meetingAgenda: IMeetingAgendaLineItem[] = [];
  public _meetingStartDateTime: Date | null = null;

  @ViewChild('agendaPreview', {static: false, read: ElementRef}) meetingAgendaPreview!: ElementRef;
  @ViewChild('picker') picker: any;


  /** 
   * Methods
   */
  constructor(private _formBuilder: FormBuilder, private _printer: PrinterService) {}

  ngOnInit(): void {
    this._meetingDetailsFormGroup = this._formBuilder.group({
      meetingNumber: ['', [Validators.required, meetingNumberValidator()]],
      meetingDate: [null, Validators.required],
      meetingTime: [null, Validators.required]
    });
    
    this._meetingRolesFormGroup = this._formBuilder.group({
    });
  }

  public async printMeetingAgenda(): Promise<void> {
    const sourceElement = this.meetingAgendaPreview.nativeElement;
    
    if (sourceElement && sourceElement.innerHTML)
      await this._printer.printElement(sourceElement);
  }

  public async meetingAgendaChanged(updatedMeetingAgenda: IMeetingAgendaLineItem[]): Promise<void> {
    this._meetingAgenda = updatedMeetingAgenda;
  }

  public async meetingDateTimeChanged() {
    const meetingDate: Date = this._meetingDetailsFormGroup?.controls?.meetingDate?.value;
    const meetingTime: string = this._meetingDetailsFormGroup?.controls?.meetingTime?.value;

    if (meetingDate && meetingTime) {
      // Concatenate the date / time for simplicity of handling
      const meetingTimeHours: number | null = this.getHoursFromTimeString(meetingTime);
      const meetingTimeMins: number | null = this.getMinsFromTimeString(meetingTime);

      if (meetingTimeHours && meetingTimeMins) {
        this._meetingStartDateTime = new Date(meetingDate.getFullYear(), meetingDate.getMonth(), meetingDate.getDate(), meetingTimeHours, meetingTimeMins);
      }
    }
  }

  private getHoursFromTimeString(timeString: string) : number | null {
    if (timeString) {
      try {
        const split = timeString.split(':');
        return split.length == 2 ? Number(split[0]) : null;
      } 
      catch (error) {
        console.error('getHoursFromTimeString: Failed to parse time string.');
      }
    }

    console.error('getHoursFromTimeString: Failed to parse time string.');
    return null;
  }

  private getMinsFromTimeString(timeString: string) : number | null {
    if (timeString) {
      try {
        const split = timeString.split(':');
        return split.length == 2 ? Number(split[1]) : null;
      } 
      catch (error) {
        console.error('getMinsFromTimeString: Failed to parse time string.');
      }
    }

    console.error('getMinsFromTimeString: Failed to parse time string.');
    return null;
  }
}
