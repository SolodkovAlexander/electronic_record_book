/**
 * Backendless app info (for HTTP-requests).
 */
export const backendlessAppInfo: any = {
    /** 
     * Part of Backendless subdomain.
     * Ex.: if subdomain = "readytemper", then Backendless subdomain = "readytemper.backendless.app".
     */
    // serverURL: "https://eu-api.backendless.com",
    subdomain: "cuddlypear",
    /**
     *  Application ID.
     */
    applicationId: "0DFA9DFB-2242-742A-FFE6-2864198CB900",
    /** 
     * REST API key.
     */
    RESTApiKey: "0ACE48F2-A627-48E1-984F-CA554A6DC74C"
};

/**
 * Some Backendless info (for HTTP-requests).
 */
export const requestSettings: any = {
    developerInfo: {
        // serverURL: "https://eu-api.backendless.com",
        url: `https://develop.backendless.com/${backendlessAppInfo.applicationId}`,
        "auth-key": "liumhkaocvikfcigjfnvjkapugishxvhsjdv"
    },
    userInfo: {
        url: `https://${backendlessAppInfo.subdomain}.backendless.app`,
        login: "admspo@gmail.com",
        password: "123456"
    }
};

/**
 * Task Backendless URL-s (for HTTP-requests).
 */
export const taskRequestUrls: any = {
    userLogin: `${requestSettings.userInfo.url}/api/users/login`,
    checkValidOfUserToken: `${requestSettings.userInfo.url}/api/users/isvalidusertoken`,
    developTableOperation: `${requestSettings.developerInfo.url}/console/data/tables`,
    tableObjectOperation: `${requestSettings.userInfo.url}/api/data/bulk`,
    updateTableObject: `${requestSettings.userInfo.url}/api/data`,
    getTableData: `${requestSettings.userInfo.url}/api/data` //just for test, yes, i know it's the same as previous row
};

/**
 * Backendless database schema (tables).
 */
export const databaseSchema: any = {
    tables: [
        {
            "name": "professor",
            "columns": [
                {
                    "name": "first_name",
                    "dataType": "STRING",
                    "dataSize": 250,
                    "required": true,
                    "unique": false,
                    "indexed": false,
                    "defaultValue": "",
                    "customRegex": null
                },
                {
                    "name": "last_name",
                    "dataType": "STRING",
                    "required": true,
                    "unique": false,
                    "indexed": false,
                    "defaultValue": "",
                    "customRegex": null
                },
                {
                    "name": "other_name",
                    "dataType": "STRING",
                    "required": false,
                    "unique": false,
                    "indexed": false,
                    "defaultValue": "",
                    "customRegex": null
                },
                {
                    "name": "academic_degree",
                    "dataType": "STRING",
                    "required": false,
                    "unique": false,
                    "indexed": false,
                    "defaultValue": "No",
                    "customRegex": null
                }
            ]
        },
        {
            "name": "student_group",
            "columns": [
                {
                    "name": "name",
                    "dataType": "STRING",
                    "required": true
                },
                {
                    "name": "description",
                    "dataType": "STRING",
                    "defaultValue": ""
                }
            ],
            references: [
                {
                    "name": "curator",
                    "dataType": "DATA_REF",
                    "required": false,
                    "indexed": false,
                    "defaultValue": null,
                    "relationshipType": "ONE_TO_ONE",
                    "toTableName": "professor",
                    fieldName: "objectId"
                }
            ]
        },
        {
            "name": "student",
            "columns": [
                {
                    "name": "first_name",
                    "dataType": "STRING",
                    "required": true
                },
                {
                    "name": "last_name",
                    "dataType": "STRING",
                    "required": true
                },
                {
                    "name": "other_name",
                    "dataType": "STRING",
                    "defaultValue": ""
                }
            ],
            references: [
                {
                    "name": "curator",
                    "dataType": "DATA_REF",
                    "required": false,
                    "indexed": false,
                    "defaultValue": null,
                    "relationshipType": "ONE_TO_ONE",
                    "toTableName": "professor",
                    fieldName: "objectId"
                }
            ]
        }
    ]
};

/**
 * Backendless database schema content (table objects).
 */
export const databaseSchemaContent: any = {
    professor: [
        {
            "first_name": "John",
            "last_name": "Brown",
            "academic_degree": "Associate degree"
        },
        {
            "first_name": "Jane",
            "last_name": "Green",
            "academic_degree": "Bachelor's degree"
        },
        {
            "first_name": "Simon",
            "last_name": "Lind",
            "academic_degree": "Bachelor's degree"
        },
        {
            "first_name": "Алексей",
            "last_name": "Вишнев",
            "other_name": "Евгеньевич",
            "academic_degree": "Master's (Magister) degree"
        },
        {
            "first_name": "Ксения",
            "last_name": "Добрякова",
            "other_name": "Михайловна",
            "academic_degree": "Associate degree"
        }
    ],
    student_group: [
        {
            "name": "M-14"
        },
        {
            "name": "M-15"
        },
        {
            "name": "M-55"
        },
        {
            "name": "M-44"
        }
    ]
};