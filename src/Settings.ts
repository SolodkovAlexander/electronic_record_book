/**
 * Backendless app info (for HTTP-requests).
 */
export const backendlessAppInfo: any = {
    /** 
     * Part of Backendless subdomain.
     * Ex.: if subdomain = "readytemper", then Backendless subdomain = "readytemper.backendless.app".
     */
    subdomain: "primosea",
    /**
     *  Application ID.
     */
    applicationId: "66FA45F3-E53D-16C3-FFBE-FDF3F161CF00",
    /** 
     * REST API key.
     */
    RESTApiKey: "5E37969E-D267-406F-AB19-2486635B82E7"
};

/**
 * Some Backendless info (for HTTP-requests).
 */
export const requestSettings: any = {
    developerInfo: {
        url: `https://develop.backendless.com/${backendlessAppInfo.applicationId}`,
        /** 
         * You can find this on any HTTP-request with data on `Data` tab (ex. create table).
         * The key may be expired?
         */
        "auth-key": "wwxnlntjitsgkyeerzqqcqoxdwojbrgtcumw"
    },
    userInfo: {
        /** 
         * Ypu can create user on `Data` tab on `System data` article.
         */
        url: `https://${backendlessAppInfo.subdomain}.backendless.app`,
        login: "admspo@gmail.com",
        password: "12345678"
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
    updateTableObject: `${requestSettings.userInfo.url}/api/data`
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