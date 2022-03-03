export class ServiceHelper {
    /**
     * Clone object to new memory reference
     * @param obj Source object to copy
     */
    public static cloneObject(obj: any): any {
        if (obj && obj instanceof Date) { // Special case for dates
            return new Date(obj.getTime());
        }

        return JSON.parse(JSON.stringify(obj));
    }
}
