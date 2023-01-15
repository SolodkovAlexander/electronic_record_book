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
import Group from '../../models/Group';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsFillPersonFill, BsFillPersonPlusFill, BsFillPersonXFill } from 'react-icons/bs';

export const GroupsPage = () => {
  // useState for tracking data after render
  const [rowData, setRowData] = useState();

  // useEffect to async call for data
  useEffect(() => {
    async function getGroupsAsync() {
      const result = await RequestHelper.getTableDataWithRelations('student_group', 'curator');;
      setRowData(result);
      console.log(result);
    }
    getGroupsAsync();
  }, []);

  const ButtonRenderer = (params: any) => {
    return <>
    <Button variant="info" onClick={() => console.log(params.data.objectId)} className="me-1">
      <Link to={"/student_group/"+params.data.objectId} className="nav-link">
        <BsFillPersonFill /> Edit
      </Link>
    </Button>
    <Button variant="danger" onClick={() => console.log(params.data.objectId)}>
      <Link to={"/student_group_delete/"+params.data.objectId} className="nav-link">
        <BsFillPersonXFill /> Remove
      </Link>
    </Button>
    </>
  };
    
  const [columnDefs] = useState(Group.describe().concat({
    field: "year",
    cellRenderer: ButtonRenderer,
    width: 220,
    resizable: true
  }));

  return (
    <div className="d-flex flex-column p-2">
      <h3>Groups</h3>
      <div className="mb-2">
        <Button variant="success">
          <Link to={"/student_group_create"} className="nav-link">
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