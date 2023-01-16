import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import Select, { OnChangeValue } from 'react-select';
import { Application } from '../../Application';
import { RequestHelper } from '../../helpers/RequestHelper';

export default function StudentEdit() {
    const { id } = useParams();

    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [other_name, setOtherName] = useState('');

    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (id) {
            getStudent(id);
        }
    }, [id]);


    const getStudent = (id: string) => {
        async function getCurrentStudentAsync() {
            const result = await RequestHelper.getTableDataObject(id, 'student');

            if (result) {
                setFirstName(result.first_name);
                setLastName(result.last_name);
                setOtherName(result.other_name);
            }
        }
        getCurrentStudentAsync();
    };


    const updateData = () => {
        setSubmitted(true);
        let rec_id = '';
        let update_student_group_url = '';
        if (id) {
            Application.updateTableObjectByObjectId('student', id.toString(), { 'first_name': first_name, 'last_name': last_name, 'other_name': other_name }, false).then(
                (response: any) => {
                    setSubmitted(true);
                    console.log(response);
                })
                .catch((e: Error) => {
                    console.log(e);
                });
        }
    };
    return (
        <div className="submit-form">
            {submitted ? (
                <div>
                    <h4>Student updated successfully!</h4>
                    {/* <button className="btn btn-success me-3" onClick={newGroup}>
                        Add another
                    </button> */}
                    <a className="btn btn-warning" role="button" href="/students">Back to Students</a>
                </div>
            ) : (
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

                    <button onClick={updateData} className="btn btn-success mt-3">
                        Update
                    </button>
                </div>
            )}
        </div>
    )
}
