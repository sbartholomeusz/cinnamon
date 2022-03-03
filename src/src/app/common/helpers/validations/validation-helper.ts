export class ValidationHelper {
    public static isValidDataUrl(url: string): boolean {
        return url != null && url.startsWith("data:");
    }

    public static isValidHttpUrl(url: string): boolean {
        if (url && url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&=]*)/g)) {
            return true;
        }

        return false;
    }

    public static isValidMeetingNumber(meetingNumber: string): boolean {
        let isValid: boolean = true;
        const parsedMeetingNumber: number = +meetingNumber;

        if(isNaN(parsedMeetingNumber)) {
            isValid = false;
            return isValid;
        }

        if(parsedMeetingNumber <= 0) {
            isValid = false;
            return isValid;
        }

        return isValid;
    }
}
