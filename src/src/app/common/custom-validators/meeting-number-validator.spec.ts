import { FormControl } from '@angular/forms';
import { meetingNumberValidator } from './meeting-number-validator';

describe('MeetingNumberValidator', () => {
    const validationFailedMsg: any = {validationError: `Meeting Number must be greater than 1.`};

    it('should be null for a valid meeting number', () => {
        const meetingNumber: string = '1';
        const result: any = meetingNumberValidator()(new FormControl(meetingNumber));
        
        expect(result).toBeNull();
    });

    it('should error for a negative meeting number', () => {
        const meetingNumber: string = '-1';
        const result: any = meetingNumberValidator()(new FormControl(meetingNumber));

        expect(result).toBeTruthy();
        expect(result).toEqual(validationFailedMsg);
    });

    it('should error for an empty string', () => {
        const meetingNumber: string = '';
        const result: any = meetingNumberValidator()(new FormControl(meetingNumber));

        expect(result).toBeTruthy();
        expect(result).toEqual(validationFailedMsg);
    });

    it('should error for alpha string', () => {
        const meetingNumber: string = 'badMeetingNumber';
        const result: any = meetingNumberValidator()(new FormControl(meetingNumber));

        expect(result).toBeTruthy();
        expect(result).toEqual(validationFailedMsg);
    });
});
