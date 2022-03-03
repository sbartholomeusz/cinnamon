import { ServiceHelper } from './service-helper';

describe('ServiceHelper', () => {
  it('should create an instance', () => {
    expect(new ServiceHelper()).toBeTruthy();
  });

  it('should create new date by value', () => {
    let sourceObj: Date = new Date();
    let clonedObj: Date = ServiceHelper.cloneObject(sourceObj);

    expect(clonedObj).toBeDefined;
    expect(clonedObj).not.toBeNull;
    expect(clonedObj).toEqual(sourceObj);
    expect(clonedObj).not.toBe(sourceObj);
  });

  it('should create new object by value', () => {
    let sourceObj: any = { id: 1, employee: "John smith", roles: [{roleName: "Acting HR Co-Ordinator"}, {roleName: "Senior Supervisor"}]};
    let clonedObj: any = ServiceHelper.cloneObject(sourceObj);

    expect(clonedObj).toBeDefined;
    expect(clonedObj).not.toBeNull;
    expect(clonedObj).toEqual(sourceObj);
    expect(clonedObj).not.toBe(sourceObj);
  });
});
