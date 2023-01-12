import React, { useEffect, useState } from 'react';

import {
  AgGridReact
} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import {
  Progress
} from 'antd';
import 'antd/dist/antd.min.css'
import { RequestHelper } from '../helpers/RequestHelper';

import Professor from '../models/Professor';

export const ProfessorsPage = () => {
  // useState for tracking data after render
  const [rowData, setRowData] = useState();

  // useEffect to async call for data
  useEffect(() => {
    async function getProfessorAsync() {
      const result = await RequestHelper.getTableData('professor');;
      setRowData(result);
      console.log(result);
    }
    getProfessorAsync();
  }, []);

  const [columnDefs] = useState(Professor.describe());
  const [applicationInitializeProgress] = useState(10);

  return (
    <div
      className="ag-theme-alpine"
      style={{ height: 300, width: 800 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}>
      </AgGridReact>
    </div>
  );
};