import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import Select, { OnChangeValue } from 'react-select';
import { Application } from '../../Application';
import { RequestHelper } from '../../helpers/RequestHelper';


// define your option type
type MyOption = { label: string, value: string }

export default function GroupEdit() {
    const { id } = useParams();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [submitted, setSubmitted] = useState(false);
    // useState for tracking data after render
    const [professors, setProfessors] = useState([{ label: 'none', value: 'none' }]);

    const [professorId, setProfessorId] = useState('');
    const [oldProfessorId, setOldProfessorId] = useState('');

    useEffect(() => {
        if (id){
            getGroup(id);
        }
    },[id]);

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

    const getGroup = (id: string) => {
        async function getCurrentGroupAsync() {
            const result = await RequestHelper.getTableDataObjectWithRelations(id, 'student_group', 'curator');
            
            if (result) {
                setName(result.name);
                setDescription(result.description);
                if (result.curator) {
                    setProfessorId(result.curator.objectId);
                    setOldProfessorId(professorId);
                }
            }
        }
        getCurrentGroupAsync();
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
        if (id){
            // update_student_group_url = 'student_group/' + id.toString();

        // { [update_student_group_url]: { "name": name, "description": description } }
        Application.updateTableObjectByObjectId('student_group',id.toString(),{"name": name, "description": description},false).then(
            (response: any) => {
                setSubmitted(true);
                console.log(response);
                // rec_id = response.student_group[0];
                // console.log(rec_id);

                let url = 'student_group/' + id.toString() + '/curator';
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
        <div className="submit-form">
            {submitted ? (
                <div>
                    <h4>Group updated successfully!</h4>
                    {/* <button className="btn btn-success me-3" onClick={newGroup}>
                        Add another
                    </button> */}
                    <a className="btn btn-warning" role="button" href="/student_group">Back to Groups</a>
                </div>
            ) : (
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
                        <label htmlFor="professor">Тьютор (закрепленный преподаватель)</label>
                        <Select id="professor" options={professors} value={professors[professors.findIndex(x => x.value === professorId)]} onChange={handleOption} />
                    </div>

                    <button onClick={updateData} className="btn btn-success mt-3">
                        Update
                    </button>
                </div>
            )}
        </div>
    )
}
