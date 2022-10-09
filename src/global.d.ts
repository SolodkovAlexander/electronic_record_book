import {
    Application
} from "./Application"

declare global {
    /**
     * Application instance.
     */
    const App: Application = new Application();
    /** 
     * Add console log record.
     * @param text Log text.
     * @param isError Is error log.
     */
    const Debug: Function = function (
        text: string,
        isError: boolean = false
    ): void {
        //Get time
        const t = new Date();
        const date = ('0' + t.getDate()).slice(-2);
        const month = ('0' + (t.getMonth() + 1)).slice(-2);
        const year = t.getFullYear().toString().slice(-2);
        const hours = ('0' + t.getHours()).slice(-2);
        const minutes = ('0' + t.getMinutes()).slice(-2);
        const seconds = ('0' + t.getSeconds()).slice(-2);
        const milliseconds = ('0' + t.getMilliseconds()).slice(-3);
        const time = `${date}.${month}.${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;

        //Log to console
        if (isError) {
            console.error(`${time} ${text}`);
        } else {
            console.log(`${time} ${text}`);
        }
    }
}