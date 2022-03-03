import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ServiceHelper } from 'src/app/common/helpers/services/service-helper';
import { IMeetingAgendaLineItem, IMember } from 'src/app/common/model/IMeetingAgendaLineItem';
import { LoggingService } from 'src/app/services/logging.service';
import { ToastmastersService } from 'src/app/services/toastmasters.service';

@Component({
  selector: 'edit-meeting-agenda',
  templateUrl: './edit-meeting-agenda.component.html',
  styleUrls: ['./edit-meeting-agenda.component.scss']
})
export class EditMeetingAgendaComponent implements OnInit {

 /** 
  * Inputs and outputs
  */
  @Input() 
  get meetingStartDateTime() {
    return this._meetingStartDateTime;
  }
  set meetingStartDateTime(value: Date | null){
    this._meetingStartDateTime = value;

    if (this._meetingStartDateTime) {
      this.initialiseForm(); // Refresh the form when date changes
    }
  }

  @Output() meetingAgendaChanged = new EventEmitter<IMeetingAgendaLineItem[]>();


  /** 
   * Global Variables
   */
  private _meetingStartDateTime: Date | null = null;
  public autoAssignMemberRoles: boolean = false;
  public clubMembersList: IMember[] = [];
  public meetingAgenda: IMeetingAgendaLineItem[] = [];
  

  /** 
   * Methods
   */
  constructor(private _logger: LoggingService, private _tmSvc: ToastmastersService) {
  }

  async ngOnInit(): Promise<void> {
    await this.initialiseForm();
  }

  private async initialiseForm() : Promise<void> {
    this._logger.Info("Start initialiseForm");
    const autoAssignMembersToRoles: boolean = this.autoAssignMemberRoles;
    await this.populateForm(autoAssignMembersToRoles); // Do not auto assign members to roles
    await this.modelHasChanged();
  }

  /**
   * Reset form values
   */  
  public async resetForm(): Promise<void> {
    this._logger.Info("Resetting form ...");
    const autoAssignMembersToRoles: boolean = this.autoAssignMemberRoles;
    await this.populateForm(autoAssignMembersToRoles); // Do not auto assign members to roles
    await this.modelHasChanged();
  }

  /**
   * Remove meeting agenda item by Id
   * @param agendaItemId Item to be removed
   */
  public async removeMeetingAgendaItem(agendaItemId: number) : Promise<void> {
    this.meetingAgenda = this.meetingAgenda?.filter(item => item.id != agendaItemId);
    await this.modelHasChanged();
  }

  /**
   * Agenda model has changed handler function
   */
  public async modelHasChanged(): Promise<void> {
    await this.doRecalcAgendaStartTimes();

    this.meetingAgendaChanged.emit(this.meetingAgenda);
  }

  /**
   * Recalculate speaker start times in the agenda
   * @returns 
   */
  public async doRecalcAgendaStartTimes(): Promise<void> {
    if (this.meetingAgenda?.length > 0 && this._meetingStartDateTime) {
      this._logger.Info("Recalculating agenda start times ...");
      await this.recalcAgendaStartTimes(ServiceHelper.cloneObject(this._meetingStartDateTime), this.meetingAgenda);
    }
  }

  /**
   * Recalculate speaker start times in the agenda
   * @param meetingStartTime Start time of the first agenda line item
   * @param agendaItems Meeting agenda items
   * @returns 
   */
  public async recalcAgendaStartTimes(meetingStartTime: Date, agendaItems: IMeetingAgendaLineItem[]): Promise<IMeetingAgendaLineItem[]> {
    this._logger.Info("Calculating start times ...");
    let runningMeetingTime = meetingStartTime;

    for (const agendaItem of agendaItems) {
      agendaItem.startTime = new Date(runningMeetingTime.getFullYear(), runningMeetingTime.getMonth(), runningMeetingTime.getDate(), runningMeetingTime.getHours(), runningMeetingTime.getMinutes(), runningMeetingTime.getSeconds(), runningMeetingTime.getMilliseconds());
      let maxAllottedTimeSec: number = agendaItem.durationSecondsRed ? agendaItem.durationSecondsRed : 0;
      runningMeetingTime.setSeconds(runningMeetingTime.getSeconds() + maxAllottedTimeSec);
    }

    return agendaItems;
  }

  /**
   * Populate meeting agenda table with data
   * @param autoFillRoles Auto assign members to meeting roles
   */
  private async populateForm(autoFillRoles: boolean=false): Promise<void> {
    try {
      this._logger.Info("Fetching members and roles ...");
      await Promise.all([this._tmSvc.getAllMembers(), this._tmSvc.getMeetingAgenda(autoFillRoles)]).then((results) => {
        this.clubMembersList = results[0]?.clubMembers;
        
        let index: number = 0;
        this.meetingAgenda = results[1]?.roles?.map(item => ({
                              id: index++, startTime: null, ...item
                             }));
      });

      if (this.clubMembersList && this.clubMembersList.length > 0) {
        this._logger.Info(`Found ${this.clubMembersList.length} club members`);
      }
      else {
        this._logger.Warning(`Found 0 club members`);
      }

      if (this.meetingAgenda && this.meetingAgenda.length > 0) {
        this._logger.Info(`Found ${this.meetingAgenda.length} club meeting roles`);
      }
      else {
        this._logger.Error(`Found 0 club meeting roles`);
      }
    }     
    catch (error: any) {
      this._logger.Error("An unexpected error occurred in EditMeetingAgendaComponent.initialiseForm ...");
      this._logger.Error(error);
    }
  }

  /**
   * Reorder Agenda Item array upon drag/drop
   * @param event 
   */
  public async onAgendaItemDropped(event: CdkDragDrop<IMeetingAgendaLineItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }     
    else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  //
  // Input Validation Functions
  //

  /**
   * Get max value for Green Light field
   * @param agendaItem 
   * @returns 
   */
    public getGreenMaxValue(agendaItem: IMeetingAgendaLineItem): number | null{
    if (agendaItem.durationSecondsRed) {
      return agendaItem.durationSecondsRed;
    }
    return agendaItem.durationSecondsAmber ? agendaItem.durationSecondsAmber : null;
  }

  /**
   * Get min value for Amber Light field
   * @param agendaItem 
   * @returns 
   */
  public getAmberMinValue(agendaItem: IMeetingAgendaLineItem): number | null{
    return agendaItem.durationSecondsGreen ? agendaItem.durationSecondsGreen : null;
  }

  /**
   * Get max value for Amber Light field
   * @param agendaItem 
   * @returns 
   */
  public getAmberMaxValue(agendaItem: IMeetingAgendaLineItem): number | null{
    return agendaItem.durationSecondsRed ? agendaItem.durationSecondsRed : null;
  }

  /**
   * Get min value for Red Light field
   * @param agendaItem 
   * @returns 
   */
  public getRedMinValue(agendaItem: IMeetingAgendaLineItem): number | null{
    let values: number[] = [];

    if (agendaItem.durationSecondsAmber) {
      return agendaItem.durationSecondsAmber;
    }
    
    return agendaItem.durationSecondsGreen ? agendaItem.durationSecondsGreen : null;
  }
}