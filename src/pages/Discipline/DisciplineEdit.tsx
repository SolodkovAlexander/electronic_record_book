import React, { useEffect, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import Select, { OnChangeValue } from 'react-select';
import { Application } from '../../Application';
import { RequestHelper } from '../../helpers/RequestHelper';


// define your option type
type MyOption = { label: string, value: string }

export default function DisciplineEdit() {
    const { id } = useParams();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [submitted, setSubmitted] = useState(false);
    // useState for tracking data after render
    const [professors, setProfessors] = useState([{ label: 'none', value: 'none' }]);

    const [professorId, setProfessorId] = useState('');
    const [oldProfessorId, setOldProfessorId] = useState('');

    useEffect(() => {
        if (id) {
            getDiscipline(id);
        }
    }, [id]);

    // useEffect to async call for data
    useEffect(() => {
        async function getProfessorAsync() {
            const result = await RequestHelper.getTableData('professor');

            let a: any[] = [];
            result.forEach((res: { last_name: any; objectId: any; }) => {
                a.push({ label: res.last_name, value: res.objectId });
            });
            // console.log(a);

            setProfessors(a);
        }
        getProfessorAsync();
    }, []);

    const getDiscipline = (id: string) => {
        async function getCurrentDisciplineAsync() {
            const result = await RequestHelper.getTableDataObjectWithRelations(id, 'discipline', 'curator');

            if (result) {
                setName(result.name);
                setDescription(result.description);
                if (result.curator) {
                    setProfessorId(result.curator.objectId);
                    setOldProfessorId(professorId);
                }
            }
        }
        getCurrentDisciplineAsync();
    };


    const handleOption = (selection: MyOption | null) => {
        //   setProfessorId(selection);
        if (selection) {
            console.log(selection.value);
            setProfessorId(selection.value);
        }
    };

    const updateData = () => {
        setSubmitted(true);
        console.log(name);
        console.log(description);
        let rec_id = '';
        let update_student_group_url = '';
        if (id) {
            // update_student_group_url = 'student_group/' + id.toString();

            // { [update_student_group_url]: { "name": name, "description": description } }
            Application.updateTableObjectByObjectId('discipline', id.toString(), { "name": name, "description": description }, false).then(
                (response: any) => {
                    setSubmitted(true);
                    console.log(response);
                    // rec_id = response.student_group[0];
                    // console.log(rec_id);

                    let url = 'discipline/' + id.toString() + '/curator';
                    console.log(url);
                    console.log('remove old relation');
                    Application.deleteTablesObjectsRelations({ [url]: oldProfessorId }).then(
                        (response: any) => {
                            console.log(response);
                        })
                        .catch((e: Error) => {
                            console.log(e);
                        });
                    console.log('add new relation');
                    Application.createTablesObjectsRelations({ [url]: professorId }).then(
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
    };
    return (
        <div className="submit-form" style={{ margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
            {submitted ? (
                <div>
                    <h4>Discipline updated successfully!</h4>
                    <a className="btn btn-warning" role="button" href="/disciplines">Back to Disciplines</a>
                </div>
            ) : (
                <Card className='mt-5' style={{ width: '40rem' }} >
                    <Card.Header>Add new discipline</Card.Header>
                    <Card.Body>

                        <div>
                            <div className="form-group">
                                <label htmlFor="name">Имя</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    name="name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Описание</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="description"
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    name="description"
                                />
                            </div>
                            <div>
                                <label htmlFor="professor">Ответственный преподаватель</label>
                                <Select id="professor" options={professors} value={professors[professors.findIndex(x => x.value === professorId)]} onChange={handleOption} />
                            </div>

                            <div className=' d-flex justify-content-center'>
                                <button onClick={updateData} className="btn btn-success mt-3">
                                    Update
                                </button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            )}
        </div>
    )
}
