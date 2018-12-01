export class Activator {
    public static key: string;
    public static get isLicensed(): boolean {
        if (Activator.key) {
            return true;
        } else {
            return false;
        }
    }
}
