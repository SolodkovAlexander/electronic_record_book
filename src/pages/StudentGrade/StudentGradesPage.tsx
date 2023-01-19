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
import Discipline from '../../models/Discipline';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsFillPersonFill, BsFillPersonPlusFill, BsFillPersonXFill } from 'react-icons/bs';
import { Application } from '../../Application';
import StudentGrade from '../../models/StudentGrade';

export const StudentGradesPage = () => {
  // useState for tracking data after render
  const [rowData, setRowData] = useState();

  async function getStudentGradesAsync() {
    const result = await RequestHelper.getTableDataWithRelations('student_grade', 'discipline,student,test_type');;
    setRowData(result);
    console.log(result);
  };

  // useEffect to async call for data
  useEffect(() => {
    getStudentGradesAsync();
  }, []);

  const deleteStudentGrade = (id: string) => {
    async function deleteCurrentStudentGradeAsync() {
      console.log(id);
      alert('Are you sure, you want to remove this student grade?');

      const result = await Application.deleteTableObjectByObjectId('student_grade', id);

      if (result) {
        alert('Student grade removed successfully.');
      }
      // refresh data in table
      getStudentGradesAsync();
    }
    deleteCurrentStudentGradeAsync();
  };

  const ButtonRenderer = (params: any) => {
    return <>
      <Button variant="info" onClick={() => console.log(params.data.objectId)} className="me-1">
        <Link to={"/student_grade/" + params.data.objectId} className="nav-link">
          <BsFillPersonFill /> Edit
        </Link>
      </Button>
      <Button variant="danger" onClick={() => deleteStudentGrade(params.data.objectId)}>
        {/* <Link to={"/student_group_delete/"+params.data.objectId} className="nav-link"> */}
        <BsFillPersonXFill /> Remove
        {/* </Link> */}
      </Button>
    </>
  };

  const [columnDefs] = useState(StudentGrade.describe().concat({
    field: 'action',
    headerName: 'Действие',
    cellRenderer: ButtonRenderer,
    width: 220,
    resizable: true
  }));

  return (
    <div className="d-flex flex-column p-2">
      <h3>StudentGrades</h3>
      <div className="mb-2">
        <Button variant="success">
          <Link to={"/student_grade_create"} className="nav-link">
            <BsFillPersonPlusFill /> Add new
          </Link>
        </Button>
      </div>

      <div
        className="ag-theme-alpine"
        style={{ height: 300, width: 1200 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}>
        </AgGridReact>
      </div>
    </div>
  );
};