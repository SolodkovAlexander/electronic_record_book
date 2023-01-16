import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import Select, { OnChangeValue } from 'react-select';
import { Application } from '../../Application';
import { RequestHelper } from '../../helpers/RequestHelper';


// define your option type
type MyOption = { label: string, value: string }

export default function ProfessorEdit() {
    const { id } = useParams();

    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [other_name, setOtherName] = useState('');
    const [academic_degree, setAcademicDegree] = useState('');

    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (id) {
            getProfessor(id);
        }
    }, [id]);


    const getProfessor = (id: string) => {
        async function getCurrentGroupAsync() {
            const result = await RequestHelper.getTableDataObject(id, 'professor');

            if (result) {
                setFirstName(result.first_name);
                setLastName(result.last_name);
                setOtherName(result.other_name);
                setAcademicDegree(result.academic_degree);
            }
        }
        getCurrentGroupAsync();
    };


    const updateData = () => {
        setSubmitted(true);
        let rec_id = '';
        let update_student_group_url = '';
        if (id) {
            Application.updateTableObjectByObjectId('professor', id.toString(), { 'first_name': first_name, 'last_name': last_name, 'other_name': other_name, 'academic_degree': academic_degree }, false).then(
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
                    <h4>Professor updated successfully!</h4>
                    {/* <button className="btn btn-success me-3" onClick={newGroup}>
                        Add another
                    </button> */}
                    <a className="btn btn-warning" role="button" href="/professors">Back to Professors</a>
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

                    <div className="form-group">
                        <label htmlFor="academic_degree">Ученая степень/звание</label>
                        <input
                            type="text"
                            className="form-control"
                            id="academic_degree"
                            required
                            value={academic_degree}
                            onChange={(e) => setAcademicDegree(e.target.value)}
                            name="academic_degree"
                        />
                    </div>

                    <button onClick={updateData} className="btn btn-success mt-3">
                        Update
                    </button>
                </div>
            )}
        </div>
    )
}
