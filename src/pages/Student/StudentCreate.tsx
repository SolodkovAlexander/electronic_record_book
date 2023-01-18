import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

import Select, { OnChangeValue } from 'react-select';
import { Application } from '../../Application';
import { RequestHelper } from '../../helpers/RequestHelper';


// define your option type
type MyOption = { label: string, value: string }

export default function StudentCreate() {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [other_name, setOtherName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [submitted, setSubmitted] = useState(false);

  const [groups, setGroups] = useState([{ label: 'none', value: 'none' }]);

  const [studentGroupId, setStudentGroupId] = useState('');

  const handleOption = (selection: MyOption | null) => {
    if (selection) {
      console.log(selection.value);
      setStudentGroupId(selection.value);
    }
  };

  // useEffect to async call for data
  useEffect(() => {
    async function getGroupAsync() {
      const result = await RequestHelper.getTableData('student_group');
      let a: any[] = [];
      result.forEach((res: { name: any; objectId: any; }) => {
        a.push({ label: res.name, value: res.objectId });
      });
      console.log(a);
      setGroups(a);
      // console.log(result);
      // console.log(professors);
    }
    getGroupAsync();
  }, []);

  const newStudent = () => {
    setFirstName('');
    setLastName('');
    setOtherName('');
    setPhone('');
    setEmail('');
    setSubmitted(false);
  }

  const postData = () => {
    setSubmitted(true);

    let rec_id = '';
    Application.createTablesObjects({ student: [{ 'first_name': first_name, 'last_name': last_name, 'other_name': other_name, 'phone': phone, 'email': email }] }).then(
      (response: any) => {
        setSubmitted(true);
        console.log(response);
        rec_id = response.student[0];
        console.log(rec_id);

        let url = 'student/' + rec_id.toString() + '/group';
        console.log(url);
        Application.createTablesObjectsRelations({ [url]: studentGroupId }).then(
          (response: any) => {
            console.log(response);
          })
          .catch((e: Error) => {
            console.log(e);
          });
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  return (
    <div className="submit-form" style={{ margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
      {submitted ? (
        <div>
          <h4>Student added successfully!</h4>
          <button className="btn btn-success me-3" onClick={newStudent}>
            Add another
          </button>
          <a className="btn btn-warning" role="button" href="/students">Back to Students</a>
        </div>
      ) : (
        <Card className='mt-5' style={{ width: '70rem' }} >
          <Card.Header>Add new student</Card.Header>
          <Card.Body>
            <div>
              <div className="row">
                <div className="form-group col-4">
                  <label htmlFor="last_name">Фамилия</label>
                  <input
                    type="text"
                    className="form-control"
                    id="last_name"
                    required
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                    name="last_name"
                  />
                </div>

                <div className="form-group col-4">
                  <label htmlFor="first_name">Имя</label>
                  <input
                    type="text"
                    className="form-control"
                    id="first_name"
                    required
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                    name="first_name"
                  />
                </div>

                <div className="form-group col-4">
                  <label htmlFor="other_name">Отчество</label>
                  <input
                    type="text"
                    className="form-control"
                    id="other_name"
                    required
                    value={other_name}
                    onChange={(e) => setOtherName(e.target.value)}
                    name="other_name"
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group col-5">
                  <label htmlFor="phone">Телефон</label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    name="phone"
                  />
                </div>

                <div className="form-group col-5">
                  <label htmlFor="email">Почта</label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                  />
                </div>
                <div className="col-2">
                  <label htmlFor="group">Группа</label>
                  <Select id="group" options={groups} onChange={handleOption} />
                </div>
              </div>

              <div className=' d-flex justify-content-center'>
                <button onClick={postData} className="btn btn-success mt-3">
                  Save
                </button>
              </div>
            </div>
          </Card.Body>
        </Card>
      )
      }
    </div >
  )
}
