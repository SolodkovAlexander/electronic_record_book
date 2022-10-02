import React, { useState } from 'react';

import { 
    AgGridReact 
} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import {
   Progress 
} from 'antd';
import 'antd/dist/antd.min.css'

export const ApplicationView = () => { 
    const [rowData] = useState([]);
    const [columnDefs] = useState([]);
    const [applicationInitializeProgress] = useState(10);

    return (  
    <div 
        className="ag-theme-alpine"
        style={{height: 400, width: 600}}>
            <Progress
                strokeColor={{
                    from: '#108ee9',
                    to: '#87d068',
                }}
                percent={applicationInitializeProgress}
                status="active"
            />
            <AgGridReact 
                rowData={rowData} 
                columnDefs={columnDefs}>
            </AgGridReact>
    </div>
    );
};