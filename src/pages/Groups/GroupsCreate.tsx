import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap'
import Select, { OnChangeValue } from 'react-select';
import { Application } from '../../Application';
import { RequestHelper } from '../../helpers/RequestHelper';


// define your option type
type MyOption = { label: string, value: string }

export default function GroupCreate() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [submitted, setSubmitted] = useState(false);
    // useState for tracking data after render
    const [professors, setProfessors] = useState([{ label: 'none', value: 'none' }]);

    const [professorId, setProfessorId] = useState('');


    // const handleSelectionChange = (option: ) => {
    //     if (option) {
    //       setMyState(option)
    //     }
    //   };

    const handleOption = (selection: MyOption | null) => {
        //   setProfessorId(selection);
        if (selection) {
            console.log(selection.value);
            setProfessorId(selection.value);
        }
    };



    // useEffect to async call for data
    useEffect(() => {
        async function getProfessorAsync() {
            const result = await RequestHelper.getTableData('professor');
            let a: any[] = [];
            result.forEach((res: { last_name: any; objectId: any; }) => {
                a.push({ label: res.last_name, value: res.objectId });
            });
            console.log(a);
            setProfessors(a);
            // console.log(result);
            // console.log(professors);
        }
        getProfessorAsync();
    }, []);


    const newGroup = () => {
        setName("");
        setDescription("");
        setSubmitted(false);
    }

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
                    <button className="btn btn-success me-3" onClick={newGroup}>
                        Add another
                    </button>
                    <a className="btn btn-warning" role="button" href="/Groups">Back to Groups</a>
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
                        <label htmlFor="description">description</label>
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
                        <Select options={professors} onChange={handleOption} />
                    </div>

                    <button onClick={postData} className="btn btn-success mt-3">
                        Save
                    </button>
                </div>
            )}
        </div>
    )
}
