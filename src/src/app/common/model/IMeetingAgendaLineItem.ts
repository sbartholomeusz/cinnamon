import { Time } from "@angular/common";

  export interface IMember {
    name: string;
  }

  export interface IMeetingAgendaLineItem {
    id: number;
    roleName: string;
    startTime: Date | null;
    durationSecondsGreen: number | null;
    durationSecondsAmber: number | null;
    durationSecondsRed: number | null;
    memberName: string;
  }