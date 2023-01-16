import React, { useEffect, useState } from 'react';

import { BsFillPersonFill, BsFillPersonPlusFill, BsFillPersonXFill } from 'react-icons/bs'

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
import { Application } from '../../Application';

export const ProfessorsPage = () => {
  // useState for tracking data after render
  const [rowData, setRowData] = useState();

  const deleteProfessor = (id: string) => {
    async function deleteCurrentProfessorAsync() {
        console.log(id);
        alert('Are you sure, you want to remove this professor?');

        const result = await Application.deleteTableObjectByObjectId('professor', id);
        
        if (result) {
            alert('Professor removed successfully.');
        }
        // refresh data in table
        getProfessorAsync();
    }
    deleteCurrentProfessorAsync();
  };

  const ButtonRenderer = (params: any) => {
    return <>
    <Button variant="info" onClick={() => console.log(params.data.objectId)} className="me-1">
      <Link to={"/professor/"+params.data.objectId} className="nav-link">
        <BsFillPersonFill /> Edit
      </Link>
    </Button>
    <Button variant="danger" onClick={() => deleteProfessor(params.data.objectId)}>
      {/* <Link to={"/professor_delete/"+params.data.objectId} className="nav-link"> */}
        <BsFillPersonXFill /> Remove
      {/* </Link> */}
    </Button>
    </>
  };

  async function getProfessorAsync() {
    const result = await RequestHelper.getTableData('professor');;
    setRowData(result);
    console.log(result);
  };

  // useEffect to async call for data
  useEffect(() => {
    getProfessorAsync();
  }, []);

  const [columnDefs] = useState(Professor.describe().concat({
    field: 'action',
    headerName: 'Действие',
    cellRenderer: ButtonRenderer,
    width: 220,
    resizable: true
  }));

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
        style={{ height: 300, width: 1100 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}>
        </AgGridReact>
      </div>
    </div>
  );
};