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
import { RequestHelper } from '../../helpers/RequestHelper';
import Student from '../../models/Student';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsFillPersonPlusFill } from 'react-icons/bs';


export const StudentsPage = () => {
  // useState for tracking data after render
  const [rowData, setRowData] = useState();

  // useEffect to async call for data
  useEffect(() => {
    async function getStudentAsync() {
      const result = await RequestHelper.getTableData('student');;
      setRowData(result);
      console.log(result);
    }
    getStudentAsync();
  }, []);

  const [columnDefs] = useState(Student.describe());
  const [applicationInitializeProgress] = useState(10);

  return (
    <div className="d-flex flex-column p-2">
      <h3>Students</h3>
      <div className="mb-2">
        <Button variant="success">
          <Link to={"/student_create"} className="nav-link">
            <BsFillPersonPlusFill /> Add new
          </Link>
        </Button>
      </div>
      <div
        className="ag-theme-alpine"
        style={{ height: 300, width: 800 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}>
        </AgGridReact>
      </div>
    </div>
  );
};