import axios from "axios";
import {
    databaseSchema,
    databaseSchemaContent,
    requestSettings,
    taskRequestUrls
} from "./Settings";

import Professor from "./models/Professor";

/**
 * HTTP-request params.
 * Main properties: url, method etc.
 */
export interface IRequestParams {
    /** HTTP-request's method. */
    method: string,
    /** HTTP-request's url. */
    url?: string
}

/**
 * Params for {@link Application.doRequest}.
 */
export interface IParamsApplicationDoRequest {
    /** HTTP-request's params (url, method, headers, etc.). */
    params: IRequestParams,
    /** HTTP-request's body. */
    dataParams?: any,
    /** Need HTTP-request's response as result. */
    needResponse?: boolean
}

/**
 * Params for {@link Application.getTablesInfo}.
 */
export interface IParamsGetTablesInfo {
    /** Value of table's property `system` (for filter). */
    system?: boolean,
    /** Need table's column info. */
    needColumnsInfo?: boolean
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

        // //Delete all existing not system tables
        // const tablesInfo: any = await Application.getTablesInfo({
        //     system: false
        // });
        // if (!(await Application.deleteTables(tablesInfo))) {
        //     return;
        // }

        // //Create new tables
        // if (!(await Application.createTables(databaseSchema.tables))) {
        //     return;
        // }

        // //Fill tables content
        // if (!(await Application.createTablesObjects(databaseSchemaContent))) {
        //     return;
        // }

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
    private static async getTablesInfo(params: IParamsGetTablesInfo | any = {}): Promise<any> {
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
        const isSystemTable: boolean = !!(params.system);
        const needColumnsInfo: boolean = !!(params.needColumnsInfo);

        //Create tables info
        let result: any = [];
        for (let fullTableInfo of doRequestResult.tables) {
            if (fullTableInfo.system !== isSystemTable) {
                continue;
            }

            let tableInfo: any = {
                name: fullTableInfo.name
            };
            if (needColumnsInfo) {
                tableInfo.columns = fullTableInfo.columns;
            }
            result.push(tableInfo);
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

        //Get all existing tables info
        const allTablesInfo: any = await Application.getTablesInfo({
            system: false,
            needColumnsInfo: true
        } as IParamsGetTablesInfo);
        if (!allTablesInfo) {
            Application.log(`Application::createTables:Get all tables info failed`, true);
            return false;
        }

        //Create links between tables (specified columns with references)
        for (let tableInfo of tablesInfo) {
            if (!tableInfo.references) {
                continue;
            }

            for (let tableReferenceInfo of tableInfo.references) {
                //Find column id in other table
                const relationIdentificationColumnId: string | undefined = (
                    allTablesInfo.find((item: any) => item.name === tableReferenceInfo.toTableName)
                        ?.columns.find((item: any) => item.name === tableReferenceInfo.fieldName)
                        ?.columnId
                );
                if (!relationIdentificationColumnId) {
                    Application.log(`Application::createTables:Create reference ${tableReferenceInfo.name} in table ${tableInfo.name} failed`, true);
                    return false;
                }

                //Define request data params
                let doRequestdataParams: any = Object.assign(
                    {
                        metaInfo: {
                            relationIdentificationColumnId: relationIdentificationColumnId
                        }
                    },
                    tableReferenceInfo
                );
                delete doRequestdataParams.fieldName;

                //Do request
                const doRequestResult: any = await Application.doRequest({
                    params: {
                        url: `${taskRequestUrls.developTableOperation}/${tableInfo.name}/columns/relation`,
                        method: "post",
                        headers: {
                            "auth-key": requestSettings.developerInfo["auth-key"]
                        }
                    } as IRequestParams,
                    dataParams: {
                        data: doRequestdataParams
                    }
                } as IParamsApplicationDoRequest);
                if (!doRequestResult || !doRequestResult.columnId) {
                    Application.log(`Application::createTables:Create column with reference ${tableReferenceInfo.name} in table ${tableInfo.name} failed`, true);
                    return false;
                }

                Application.log(`Application::createTables:Column with reference ${tableReferenceInfo.name} in table ${tableInfo.name} created`);
            }
        }

        return true;
    }

    /**
     * Create new objects in tables.
     * @param tablesObjectsInfo Tables objects info.
     * @returns Operation result.
     */
    public static async createTablesObjects(tablesObjectsInfo: any): Promise<any | null> {
        //Create new objects in each table
        let result: any = {};
        for (let tableName in tablesObjectsInfo) {
            const doRequestResult: any = await Application.doRequest({
                params: {
                    url: `${taskRequestUrls.tableObjectOperation}/${tableName}`,
                    method: "post",
                    headers: {
                        "user-token": Application.userToken
                    }
                } as IRequestParams,
                dataParams: {
                    data: tablesObjectsInfo[tableName]
                }
            } as IParamsApplicationDoRequest);
            if (!doRequestResult || Object.keys(doRequestResult).length !== tablesObjectsInfo[tableName].length) {
                Application.log(`Application::createTables:Create new objects in ${tableName} failed`, true);
                return null;
            }

            Application.log(`Application::createTables:Create new objects in ${tableName} finished`);
            result[tableName] = doRequestResult;
        }

        return result;
    }

    /**
     * Create new object in table.
     * @param tableName Table name.
     * @param tableObjectInfo Table object info.
     * @returns Operation result (value of `objectId` column).
     */
    public static async createTableObject(
        tableName: string,
        tableObjectInfo: any
    ): Promise<any | null> {
        //Call method with many table objects
        let params: any = {};
        params[tableName] = [tableObjectInfo];
        const createTablesObjectsResult: any | null = await Application.createTablesObjects(params);
        if (!createTablesObjectsResult) {
            return null;
        }

        return createTablesObjectsResult[tableName];
    }

    /**
     * Delete objects in tables.
     * @param tablesObjectsInfo Tables objects info.
     * @returns Operation result.
     */
    public static async deleteTablesObjects(tablesObjectsInfo: any): Promise<any | null> {
        //Create new objects to each table
        let result: any = {};
        for (let tableName in tablesObjectsInfo) {
            if (tablesObjectsInfo[tableName].length === 0) {
                continue;
            }

            const doRequestResult: any = await Application.doRequest({
                params: {
                    url: `${taskRequestUrls.tableObjectOperation}/${tableName}`,
                    method: "delete",
                    headers: {
                        "user-token": Application.userToken
                    },
                    params: {
                        where: tablesObjectsInfo[tableName]
                    }
                } as IRequestParams
            } as IParamsApplicationDoRequest);

            Application.log(`Application::deleteTablesObjects:From ${tableName} ${doRequestResult} objects deleted`);
            result[tableName] = doRequestResult;
        }

        return result;
    }

    /**
     * Delete objects in table by column `objectId` values.
     * @param tableName Table name.
     * @param objectIds Table objects column `objectId` values.
     * @returns Operation result.
     */
    public static async deleteTablesObjectsByObjectId(
        tableName: string,
        objectIds: Array<string>
    ): Promise<any> {
        //Call base method with where clause
        let params: any = {};
        params[tableName] = `objectId IN ('${objectIds.join(`','`)}')`;
        return await Application.deleteTablesObjects(params);
    }

    /**
     * Delete object in table by column `objectId` values.
     * @param tableName Table name.
     * @param objectId Table object column `objectId` value.
     * @returns Operation success/fail.
     */
    public static async deleteTableObjectByObjectId(
        tableName: string,
        objectId: string
    ): Promise<boolean> {
        //Call base method with where clause
        let params: any = {};
        params[tableName] = `objectId = '${objectId}'`;
        return (await Application.deleteTablesObjects(params))[tableName] === 1;
    }

    /**
     * Update objects in tables.
     * @param tablesObjectsInfo Tables objects info.
     * @returns Operation result.
     */
    public static async updateTablesObjects(tablesObjectsInfo: any): Promise<any> {
        //Update objects to each table
        let result: any = {};
        for (let tableName in tablesObjectsInfo) {
            if (tablesObjectsInfo[tableName].length === 0) {
                continue;
            }

            const doRequestResult: any = await Application.doRequest({
                params: {
                    url: `${taskRequestUrls.tableObjectOperation}/${tableName}`,
                    method: "put",
                    headers: {
                        "user-token": Application.userToken
                    },
                    params: {
                        where: tablesObjectsInfo[tableName].where
                    }
                } as IRequestParams,
                dataParams: {
                    data: tablesObjectsInfo[tableName].data
                }
            } as IParamsApplicationDoRequest);

            Application.log(
                `Application::updateTablesObjects:In ${tableName} ${doRequestResult} objects updated`,
                true
            );
            result[tableName] = doRequestResult;
        }

        return result;
    }

    /**
     * Update object in table by column `objectId` value.
     * @param tableName Table name.
     * @param tableObjectInfo Table object info.
     * @param tableObjectInfo Table object info.
     * @returns Operation success/fail.
     */
    public static async updateTableObjectByObjectId(
        tableName: string,
        objectId: string,
        tableObjectInfo: any,
        useMultipleUpdateMethod: boolean = false
    ): Promise<boolean> {
        //Call update multiple objects method with where clause
        if (useMultipleUpdateMethod) {
            let params: any = {};
            params[tableName] = {
                where: `objectId = '${objectId}'`,
                data: tableObjectInfo
            };
            return (await Application.updateTablesObjects(params))[tableName] === 1;
        }

        //Update single object method
        const doRequestResult: any = await Application.doRequest({
            params: {
                url: `${taskRequestUrls.updateTableObject}/${tableName}/${objectId}`,
                method: "put",
                headers: {
                    "user-token": Application.userToken
                }
            } as IRequestParams,
            dataParams: {
                data: tableObjectInfo
            }
        } as IParamsApplicationDoRequest);
        if (!doRequestResult || doRequestResult.objectId !== objectId) {
            Application.log(`Application::updateTableObjectByObjectId:Update object ${objectId} in ${tableName} failed`, true);
            return false;
        }

        Application.log(`Application::updateTableObjectByObjectId:Update object ${objectId} in ${tableName} finished`);
        return true;
    }
}