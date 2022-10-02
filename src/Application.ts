import axios from "axios";
import {
    databaseSchema,
    databaseSchemaContent,
    requestSettings,
    taskRequestUrls
} from "./Settings";

export interface IRequestParams {
    method: string,
    url?: string
}

export interface IParamsApplicationDoRequest {
    params: IRequestParams,
    dataParams?: any,
    needResponse?: boolean
}

export interface IParamsGetTablesInfo {
    system?: boolean
}

export class Application {
    /** 
     * Is application initialized.
     */
    private static initilized: boolean = false;
    /**
     * User token for HTTP-requests.
     * Updating by {@link Application.loginAsUser} with user info from {@link requestSettings}.
     */
    private static userToken: string = "";

    /**
     * Initialize application.
     */
    public static async init(): Promise<void> {
        //If application isn't initilized: exit
        if (Application.initilized) {
            return;
        }

        //Login user
        if (!(await Application.loginAsUser())) {
            return;
        }

        //Delete all existing not system tables
        const tablesInfo: any = await Application.getTablesInfo({
            system: false
        });
        if (!(await Application.deleteTables(tablesInfo))) {
            return;
        }

        //Create new tables
        if (!(await Application.createTables(databaseSchema.tables))) {
            return;
        }

        //Fill tables content
        if (!(await Application.saveTablesObjects(databaseSchemaContent))) {
            return;
        }

        Application.initilized = true;
    }

    /**
     * Execute HTTP-request.
     * @param params Operation params (request params, data params).
     * @returns HTTP-request data or undefined.
     */
    public static async doRequest(params: IParamsApplicationDoRequest): Promise<any> {
        return await axios({
            ...params.params,
            ...params.dataParams
        }).then((response: any) => {
            if (!response) {
                return undefined;
            }
            if (params.needResponse === true) {
                return response;
            }

            return response.data;
        }).catch(() => {
            Application.log(`Application::doRequest:Request finished with error ${JSON.stringify(params)}`, true);
        });
    }

    /** 
     * Add console log record.
     * @param text Log text.
     * @param isError Is error log.
     */
    public static log(
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

    /**
     * Login user by user info from {@link requestSettings}.
     * @returns Operation success/fail.
     */
    private static async loginAsUser(): Promise<boolean> {
        //Find cached user token
        let cachedUsersInfo: any = JSON.parse(localStorage.getItem("usersInfo") || "[]");
        for (let i = 0; i < cachedUsersInfo.length; ++i) {
            if (cachedUsersInfo[i].login !== requestSettings.userInfo.login) {
                continue;
            }

            //Check valid of cached user token
            if (await Application.checkValidOfUserToken(cachedUsersInfo[i]["user-token"])) {
                Application.userToken = cachedUsersInfo[i]["user-token"];
                return true;
            }

            //Remove cached user info and update cached users info
            cachedUsersInfo.splice(i, 1);
            localStorage.setItem("usersInfo", JSON.stringify(cachedUsersInfo));
            break;
        }

        //Login user (for get user token)
        const doRequestResult: any = await Application.doRequest({
            params: {
                url: taskRequestUrls.userLogin,
                method: "post"
            } as IRequestParams,
            dataParams: {
                data: requestSettings.userInfo
            }
        } as IParamsApplicationDoRequest);
        if (!doRequestResult || !doRequestResult["user-token"]) {
            return false;
        }

        //Check valid of user token
        if (!(await Application.checkValidOfUserToken(doRequestResult["user-token"]))) {
            return false;
        }

        //Remember user token
        Application.userToken = doRequestResult["user-token"];

        //Update cached users info
        cachedUsersInfo.push({
            login: requestSettings.userInfo.login,
            "user-token": doRequestResult["user-token"]
        });
        localStorage.setItem("usersInfo", JSON.stringify(cachedUsersInfo));

        return true;
    }

    /**
     * Check valid of user token.
     * @param userToken User token.
     * @returns Operation success/fail.
     */
    private static async checkValidOfUserToken(userToken: string) {
        return (await Application.doRequest({
            params: {
                url: `${taskRequestUrls.checkValidOfUserToken}/${userToken}`,
                method: "get"
            } as IRequestParams
        } as IParamsApplicationDoRequest) === true);
    }

    /**
     * Return existing tables info.
     * @param params Operation params (filter tables, ..).
     * @returns Tables info.
     */
    private static async getTablesInfo(params: IParamsGetTablesInfo): Promise<any> {
        let doRequestResult: any = await Application.doRequest({
            params: {
                url: taskRequestUrls.developTableOperation,
                method: "get",
                headers: {
                    "auth-key": requestSettings.developerInfo["auth-key"]
                }
            } as IRequestParams
        } as IParamsApplicationDoRequest);
        if (!doRequestResult) {
            return null;
        }

        //Parse params
        const isSystemTable: boolean = !!params.system;

        //Create tables info
        let result: any = [];
        for (let fullTableInfo of doRequestResult.tables) {
            if (fullTableInfo.system !== isSystemTable) {
                continue;
            }

            result.push({
                name: fullTableInfo.name
            });
        }

        return result;
    }

    /**
     * Delete tables.
     * @param tablesInfo Tables info.
     * @returns Operation success/fail.
     */
    private static async deleteTables(tablesInfo: any): Promise<boolean> {
        if (!tablesInfo) {
            return false;
        }

        //WTF IS GOING ON: Is there one query for delete all tables specified by names?
        //Don't know. So delete each table manually.

        //Delete each table
        for (let tableInfo of tablesInfo) {
            const doRequestResult: any = await Application.doRequest({
                params: {
                    url: `${taskRequestUrls.developTableOperation}/${tableInfo.name}`,
                    method: "delete",
                    headers: {
                        "auth-key": requestSettings.developerInfo["auth-key"]
                    }
                } as IRequestParams,
                needResponse: true
            } as IParamsApplicationDoRequest);
            if (!doRequestResult || doRequestResult.status !== 204) {
                Application.log(`Application::deleteTables:Delete table ${tableInfo.name} failed`, true);
                return false;
            }

            Application.log(`Application::deleteTables:Table ${tableInfo.name} deleted`);
        }

        return true;
    }

    /**
     * Create tables.
     * @param tablesInfo Tables info.
     * @returns Operation success/fail.
     */
    private static async createTables(tablesInfo: any): Promise<boolean> {
        if (!tablesInfo) {
            return false;
        }

        //Create each table
        for (let tableInfo of tablesInfo) {
            const doRequestResult: any = await Application.doRequest({
                params: {
                    url: taskRequestUrls.developTableOperation,
                    method: "post",
                    headers: {
                        "auth-key": requestSettings.developerInfo["auth-key"]
                    }
                } as IRequestParams,
                dataParams: {
                    data: {
                        name: tableInfo.name
                    }
                }
            } as IParamsApplicationDoRequest);
            if (!doRequestResult || !doRequestResult.tableId) {
                Application.log(`Application::createTables:Create table ${tableInfo.name} failed`, true);
                return false;
            }

            Application.log(`Application::createTables:Table ${tableInfo.name} created`);

            //WTF IS GOING ON: creating table with columns with one query not work well:
            //all columns data types are UNKNOWN. So we create each column manually.
            //But it is so long!

            //Create table columns
            for (let tableColumnInfo of tableInfo.columns) {
                const doRequestResult: any = await Application.doRequest({
                    params: {
                        url: `${taskRequestUrls.developTableOperation}/${tableInfo.name}/columns`,
                        method: "post",
                        headers: {
                            "auth-key": requestSettings.developerInfo["auth-key"]
                        }
                    } as IRequestParams,
                    dataParams: {
                        data: tableColumnInfo
                    }
                } as IParamsApplicationDoRequest);
                if (!doRequestResult || !doRequestResult.columnId) {
                    Application.log(`Application::createTables:Create column ${tableColumnInfo.name} in table ${tableInfo.name} failed`, true);
                    return false;
                }

                Application.log(`Application::createTables:Column ${tableColumnInfo.name} in table ${tableInfo.name} created`);
            }
        }

        return true;
    }

    /**
     * Save objects in tables.
     * @param tablesObjectsInfo Tables objects info.
     * @returns Operation success/fail.
     */
    public static async saveTablesObjects(tablesObjectsInfo: any): Promise<boolean> {
        if (!tablesObjectsInfo) {
            return false;
        }

        //Save objects to each table
        for (let tableName in tablesObjectsInfo) {
            const doRequestResult: any = await Application.doRequest({
                params: {
                    url: `${taskRequestUrls.saveTablesObjects}/${tableName}`,
                    method: "post",
                    headers: {
                        "auth-key": requestSettings.developerInfo["auth-key"]
                    }
                } as IRequestParams,
                dataParams: {
                    data: tablesObjectsInfo[tableName]
                }
            } as IParamsApplicationDoRequest);
            if (!doRequestResult || Object.keys(doRequestResult).length !== tablesObjectsInfo[tableName].length) {
                Application.log(`Application::createTables:Save objects to ${tableName} failed`, true);
                return false;
            }

            Application.log(`Application::createTables:All objects to ${tableName} saved`);
        }

        return true;
    }
}