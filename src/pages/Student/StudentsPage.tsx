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
import { BsFillPersonFill, BsFillPersonPlusFill, BsFillPersonXFill } from 'react-icons/bs';
import { Application } from '../../Application';


export const StudentsPage = () => {
  // useState for tracking data after render
  const [rowData, setRowData] = useState();

  async function getStudentsAsync() {
    const result = await RequestHelper.getTableDataWithRelations('student', 'group');;
    setRowData(result);
    console.log(result);
  };

  // useEffect to async call for data
  useEffect(() => {
    getStudentsAsync();
  }, []);


  const deleteStudent = (id: string) => {
    async function deleteCurrentProfessorAsync() {
        console.log(id);
        alert('Are you sure, you want to remove this student?');

        const result = await Application.deleteTableObjectByObjectId('student', id);
        
        if (result) {
            alert('Student removed successfully.');
        }
        // refresh data in table
        getStudentAsync();
    }
    deleteCurrentProfessorAsync();
  };

  const ButtonRenderer = (params: any) => {
    return <>
    <Button variant="info" onClick={() => console.log(params.data.objectId)} className="me-1">
      <Link to={"/student/"+params.data.objectId} className="nav-link">
        <BsFillPersonFill /> Edit
      </Link>
    </Button>
    <Button variant="danger" onClick={() => deleteStudent(params.data.objectId)}>
      <BsFillPersonXFill /> Remove
    </Button>
    </>
  };

  async function getStudentAsync() {
    const result = await RequestHelper.getTableData('student');;
    setRowData(result);
    console.log(result);
  }

  // useEffect to async call for data
  useEffect(() => {
    getStudentAsync();
  }, []);

  const [columnDefs] = useState(Student.describe().concat({
    field: 'action',
    headerName: 'Действие',
    cellRenderer: ButtonRenderer,
    width: 220,
    resizable: true
  }));

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
        style={{ height: 300, width: 1400 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}>
        </AgGridReact>
      </div>
    </div>
  );
};