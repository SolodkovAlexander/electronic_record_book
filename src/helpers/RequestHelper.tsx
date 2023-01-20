// Moved some requests logic from Application file
import axios from "axios";
import {
  databaseSchema,
  databaseSchemaContent,
  requestSettings,
  taskRequestUrls
} from "../Settings";

import Professor from "../models/Professor";
import { Application, IParamsApplicationDoRequest, IRequestParams } from "../Application";

export class RequestHelper {
  
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
      RequestHelper.log(`Application::doRequest:Request finished with error ${JSON.stringify(params)}`, true);
    });
  }

  /**
 * Fetch all data from table with tableName.
 * @param tableName Tables name.
 * @returns data set.
 */
  public static async getTableData(tableName: string): Promise<any> {
    if (!tableName) {
      return false;
    }

    let doRequestResult: any = await RequestHelper.doRequest({
      params: {
        url: `${taskRequestUrls.getTableData}/${tableName}`,
        method: "get",
        headers: {
          "auth-key": requestSettings.developerInfo["auth-key"]
        }
      } as IRequestParams
    } as IParamsApplicationDoRequest);
    if (!doRequestResult) {
      return null;
    }

    return doRequestResult;
  }

      /**
 * Fetch all data from table with tableName.
 * @param tableName Tables name.
 * @returns data set.
 */
      public static async getTableDataObject(objectId: string, tableName: string): Promise<any> {
        if (!tableName) {
          return false;
        }
    
        let doRequestResult: any = await RequestHelper.doRequest({
          params: {
            url: `${taskRequestUrls.getTableData}/${tableName}/${objectId}`,
            method: "get",
            headers: {
              "auth-key": requestSettings.developerInfo["auth-key"]
            }
          } as IRequestParams
        } as IParamsApplicationDoRequest);
        if (!doRequestResult) {
          return null;
        }
    
        return doRequestResult;
      }  
  

    /**
 * Fetch all data from table with tableName.
 * @param tableName Tables name.
 * @returns data set.
 */
    public static async getTableDataObjectWithRelations(objectId: string, tableName: string, relationName: string): Promise<any> {
      if (!tableName) {
        return false;
      }
  
      let doRequestResult: any = await RequestHelper.doRequest({
        params: {
          url: `${taskRequestUrls.getTableData}/${tableName}/${objectId}?loadRelations=${relationName}`,
          method: "get",
          headers: {
            "auth-key": requestSettings.developerInfo["auth-key"]
          }
        } as IRequestParams
      } as IParamsApplicationDoRequest);
      if (!doRequestResult) {
        return null;
      }
  
      return doRequestResult;
    }  
  

  /**
 * Fetch all data from table with tableName.
 * @param tableName Tables name.
 * @returns data set.
 */
  public static async getTableDataWithRelations(tableName: string, relationName: string): Promise<any> {
    if (!tableName) {
      return false;
    }

    let doRequestResult: any = await RequestHelper.doRequest({
      params: {
        url: `${taskRequestUrls.getTableData}/${tableName}?loadRelations=${relationName}`,
        method: "get",
        headers: {
          "auth-key": requestSettings.developerInfo["auth-key"]
        }
      } as IRequestParams
    } as IParamsApplicationDoRequest);
    if (!doRequestResult) {
      return null;
    }

    return doRequestResult;
  }  
//   /**
//  * Create new objects in tables.
//  * @param tablesObjectsInfo Tables objects info.
//  * @returns Operation result.
//  */
//   public static async createTablesObjects(tablesObjectsInfo: any): Promise<any | null> {
//     //Create new objects in each table
//     let result: any = {};
//     for (let tableName in tablesObjectsInfo) {
//       const doRequestResult: any = await RequestHelper.doRequest({
//         params: {
//           url: `${taskRequestUrls.tableObjectOperation}/${tableName}`,
//           method: "post",
//           headers: {
//             "user-token": Application.userToken
//           }
//         } as IRequestParams,
//         dataParams: {
//           data: tablesObjectsInfo[tableName]
//         }
//       } as IParamsApplicationDoRequest);
//       if (!doRequestResult || Object.keys(doRequestResult).length !== tablesObjectsInfo[tableName].length) {
//         RequestHelper.log(`Application::createTables:Create new objects in ${tableName} failed`, true);
//         return null;
//       }

//       RequestHelper.log(`Application::createTables:Create new objects in ${tableName} finished`);
//       result[tableName] = doRequestResult;
//     }

//     return result;
//   };
};
