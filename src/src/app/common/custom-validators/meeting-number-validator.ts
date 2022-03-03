import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { ValidationHelper } from "../helpers/validations/validation-helper";

export function meetingNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const isValid = ValidationHelper.isValidMeetingNumber(control.value);
        return !isValid ? {validationError: 'Meeting Number must be greater than 1.'} : null;
    };
}