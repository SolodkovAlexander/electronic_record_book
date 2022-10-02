import React, { useState } from 'react';

import { 
    AgGridReact 
} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

export const ApplicationView = () => { 
  const [rowData] = useState([]);
  const [columnDefs] = useState([]);

  return (  
  <div 
  className="ag-theme-alpine"
  style={{height: 400, width: 600}}>
    <AgGridReact 
    rowData={rowData} 
    columnDefs={columnDefs}>
    </AgGridReact>
  </div>
)
};