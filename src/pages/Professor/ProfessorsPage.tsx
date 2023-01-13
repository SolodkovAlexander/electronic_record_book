import React, { useEffect, useState } from 'react';

import { BsFillPersonPlusFill } from 'react-icons/bs'

import {
  AgGridReact
} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import {
  Progress
} from 'antd';
import 'antd/dist/antd.min.css'
import { RequestHelper } from '../../helpers/RequestHelper';

import Professor from '../../models/Professor';
import { Button, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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
    <div className="d-flex flex-column p-2">
      <h3>Professors</h3>
      <div className="mb-2">
        <Button variant="success">
        <Link to={"/professor_create"} className="nav-link">
            <BsFillPersonPlusFill /> Add new
        </Link>
        </Button>
      </div>  
      <div
        className="ag-theme-alpine"
        style={{ height: 300, width: 900 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}>
        </AgGridReact>
      </div>
    </div>
  );
};