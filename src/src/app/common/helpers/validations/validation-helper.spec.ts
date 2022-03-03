import { ValidationHelper } from "./validation-helper";

describe('ValidationHelper', () => {

  //
  // *** Data URL Validation ***
  //

  it('should return true for good data url', () => {
    const goodDataUrl: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
    expect(ValidationHelper.isValidDataUrl(goodDataUrl)).toBeTruthy();
  });

  it('should return false for null data url', () => {
    const badDataUrl: any = null;
    expect(ValidationHelper.isValidDataUrl(badDataUrl)).toBeFalsy();
  });

  it('should return false for empty data url', () => {
    const badDataUrl: string = "";
    expect(ValidationHelper.isValidDataUrl(badDataUrl)).toBeFalsy();
  });

  it('should return false for bad data url', () => {
    const badDataUrl: string = "https://www.google.com";
    expect(ValidationHelper.isValidDataUrl(badDataUrl)).toBeFalsy();
  });


  //
  // *** HTTP URL Validation ***
  //

  it('should return true for valid https url', () => {
    const goodUrl: string = "https://www.google.com";
    expect(ValidationHelper.isValidHttpUrl(goodUrl)).toBeTruthy();
  });

  it('should return true for valid http url', () => {
    const goodUrl: string = "http://www.google.com";
    expect(ValidationHelper.isValidHttpUrl(goodUrl)).toBeTruthy();
  });

  it('should return true for valid url', () => {
    const goodUrl: string = "www.google.com";
    expect(ValidationHelper.isValidHttpUrl(goodUrl)).toBeTruthy();
  });

  it('should return false for null url', () => {
    const badUrl: any = null;
    expect(ValidationHelper.isValidHttpUrl(badUrl)).toBeFalsy();
  });

  it('should return false for empty url', () => {
    const badUrl: string = "";
    expect(ValidationHelper.isValidHttpUrl(badUrl)).toBeFalsy();
  });

  it('should return false for data url', () => {
    const badUrl: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
    expect(ValidationHelper.isValidHttpUrl(badUrl)).toBeFalsy();
  });


  //
  // *** Meeting Number Validation ***
  //
  it('should return true for valid meeting number', () => {
    const meetingNumber: string = '1';
    expect(ValidationHelper.isValidMeetingNumber(meetingNumber)).toBeTruthy();
  });

  it('should return false for null meeting number', () => {
    const meetingNumber: any = null;
    expect(ValidationHelper.isValidMeetingNumber(meetingNumber)).toBeFalsy();
  });

  it('should return false for invalid meeting number of 0', () => {
    const meetingNumber: string = '0';
    expect(ValidationHelper.isValidMeetingNumber(meetingNumber)).toBeFalsy();
  });

  it('should return false for invalid meeting number of -1', () => {
    const meetingNumber: string = '-1';
    expect(ValidationHelper.isValidMeetingNumber(meetingNumber)).toBeFalsy();
  });
  
});
