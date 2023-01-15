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

    // useEffect to async call for data
    useEffect(() => {
        async function getProfessorAsync() {
            const result = new Promise<any>((resolve, reject) => { resolve(RequestHelper.getTableData('professor')) });

            result.then((res: any) => {
                let a: any[] = [];
                res.forEach((res: { last_name: any; objectId: any; }) => {
                    a.push({ label: res.last_name, value: res.objectId });
                });
                console.log(a);

                let prof = new Promise<any>((resolve, reject) => {
                    resolve(setProfessors(a));
                });

                prof.then((prof_res) => {
                    if (id) {
                        let b = new Promise<any>((resolve, reject) => { resolve(getGroup(id)) });
                        b.then((b_res) => {
                            console.log('defaultValue');
                            console.log(professors);
                            console.log(professors[professors.findIndex(x => x.value === professorId)]);


                            console.log('defaultValue after');
                            console.log(professors);
                            console.log(professors[professors.findIndex(x => x.value === professorId)]);
                        });

                    }
                }
                );

            })

            // console.log('defaultValue try 2');
            // console.log(professors);
            // console.log(professors[professors.findIndex(x => x.value === professorId)]);

            // console.log(result);
            // console.log(professors);
        }
        getProfessorAsync();
        // console.log('defaultValue try 2');
        // console.log(professors);
        // console.log(professors[professors.findIndex(x => x.value === professorId)]);


    }, [id]);

    const getGroup = (id: string) => {
        async function getCurrentGroupAsync() {
            const result = await new Promise<any>((resolve, reject) => { resolve(RequestHelper.getTableDataObjectWithRelations(id, 'student_group', 'curator')) });
            // let a: any[] = [];
            // result.forEach((res: { last_name: any; objectId: any; }) => {
            //     a.push({ label: res.last_name, value: res.objectId });
            // });
            if (result) {
                setName(result.name);
                setDescription(result.description);
                if (result.curator) {
                    setProfessorId(result.curator.objectId);
                    console.log('pupapaa');
                    console.log(result.curator.objectId);
                    console.log(professorId);
                }
            }

            // setProfessors(a);
            // console.log(result);
            // console.log(professors);
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

    // useEffect(() => {
    //     if (id)
    //       getGroup(id);
    //   }, [id]);

    const postData = () => {
        setSubmitted(true);
        console.log(name);
        console.log(description);
        let rec_id = '';
        Application.createTablesObjects({ student_group: [{ "name": name, "description": description }] }).then(
            (response: any) => {
                setSubmitted(true);
                console.log(response);
                rec_id = response.student_group[0];
                console.log(rec_id);

                let url = 'student_group/' + rec_id.toString() + '/curator';
                console.log(url);
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
    return (
        <div className="submit-form">
            {submitted ? (
                <div>
                    <h4>Group added successfully!</h4>
                    {/* <button className="btn btn-success me-3" onClick={newGroup}>
                        Add another
                    </button> */}
                    <a className="btn btn-warning" role="button" href="/Groups">Back to Groups</a>
                </div>
            ) : (
                <div>
                    <div>{id}</div>
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

                    <button onClick={postData} className="btn btn-success mt-3">
                        Save
                    </button>
                </div>
            )}
        </div>
    )
}
